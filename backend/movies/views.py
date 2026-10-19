from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import F, Q
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Movie, MyListItem, Reaction, WatchProgress
from .serializers import CredentialsSerializer, MovieSerializer, RegisterSerializer

SORTS = {"tension": ("-tension", "-views"), "new": ("-year",), "top": ("-views",)}


def token_response(user, code=status.HTTP_200_OK):
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "username": user.username}, status=code)


def get_movie(pk):
    try:
        return Movie.objects.get(pk=pk)
    except (Movie.DoesNotExist, ValueError, TypeError):
        return None


def not_found():
    return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)


# ---------- auth ----------
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    ser = RegisterSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    user = User.objects.create_user(**ser.validated_data)
    return token_response(user, status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    ser = CredentialsSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    user = authenticate(**ser.validated_data)
    if not user:
        return Response({"detail": "Wrong username or password."}, status=status.HTTP_400_BAD_REQUEST)
    return token_response(user)


# ---------- catalogue ----------
class MovieList(generics.ListAPIView):
    """GET /api/movies/?q=&subgenre=&sort=tension|new|top&limit=10"""
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        p = self.request.query_params
        qs = Movie.objects.all()
        if p.get("q"):
            q = p["q"]
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q) | Q(director__icontains=q) | Q(cast__icontains=q))
        if p.get("subgenre"):
            qs = qs.filter(subgenre__iexact=p["subgenre"])
        if p.get("sort") in SORTS:
            qs = qs.order_by(*SORTS[p["sort"]])
        if p.get("limit", "").isdigit():
            qs = qs[: int(p["limit"])]
        return qs


# ---------- per-user data ----------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        "saved": list(MyListItem.objects.filter(user=request.user).values_list("movie_id", flat=True)),
        "reactions": {r.movie_id: r.value for r in Reaction.objects.filter(user=request.user)},
    })


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def my_list(request):
    if request.method == "POST":
        movie = get_movie(request.data.get("movie_id"))
        if not movie:
            return not_found()
        item, created = MyListItem.objects.get_or_create(user=request.user, movie=movie)
        if not created:
            item.delete()
        return Response({"saved": created})
    movies = Movie.objects.filter(mylistitem__user=request.user).order_by("-mylistitem__added_at")
    return Response(MovieSerializer(movies, many=True).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def progress(request):
    if request.method == "POST":
        movie = get_movie(request.data.get("movie_id"))
        if not movie:
            return not_found()
        try:
            seconds = max(0.0, float(request.data.get("seconds")))
            duration = max(0.0, float(request.data.get("duration")))
        except (TypeError, ValueError):
            return Response({"detail": "seconds and duration must be numbers."}, status=status.HTTP_400_BAD_REQUEST)
        _, created = WatchProgress.objects.update_or_create(
            user=request.user, movie=movie, defaults={"seconds": seconds, "duration": duration})
        if created:  # first time this user watches it -> counts as a view
            Movie.objects.filter(pk=movie.pk).update(views=F("views") + 1)
        return Response({"ok": True})
    rows = WatchProgress.objects.filter(user=request.user, seconds__gt=5).select_related("movie")
    return Response([
        {"movie": MovieSerializer(p.movie).data, "seconds": p.seconds, "duration": p.duration}
        for p in rows if p.duration and p.seconds / p.duration < 0.95   # hide finished titles
    ])


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def react(request):
    movie = get_movie(request.data.get("movie_id"))
    if not movie:
        return not_found()
    value = request.data.get("value")
    if value not in (1, -1, 0):
        return Response({"detail": "value must be 1, -1 or 0."}, status=status.HTTP_400_BAD_REQUEST)
    if value == 0:
        Reaction.objects.filter(user=request.user, movie=movie).delete()
    else:
        Reaction.objects.update_or_create(user=request.user, movie=movie, defaults={"value": value})
    return Response({"value": value})
