from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Movie, MyListItem
from .serializers import CredentialsSerializer, MovieSerializer, RegisterSerializer


def token_response(user, code=status.HTTP_200_OK):
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "username": user.username}, status=code)


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


class MovieList(generics.ListAPIView):
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        qs = Movie.objects.all()
        q = self.request.query_params.get("q")
        genre = self.request.query_params.get("genre")
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))
        if genre:
            qs = qs.filter(genre__iexact=genre)
        return qs


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def my_list(request):
    if request.method == "POST":
        try:
            movie = Movie.objects.get(pk=request.data.get("movie_id"))
        except (Movie.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)
        item, created = MyListItem.objects.get_or_create(user=request.user, movie=movie)
        if not created:
            item.delete()
        return Response({"saved": created})
    movies = Movie.objects.filter(mylistitem__user=request.user).order_by("-mylistitem__added_at")
    return Response(MovieSerializer(movies, many=True).data)
