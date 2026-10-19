from django.conf import settings
from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    genre = models.CharField(max_length=50, db_index=True)
    year = models.PositiveIntegerField(default=2024)
    rating = models.CharField(max_length=10, default="PG-13")
    duration_min = models.PositiveIntegerField(default=100)
    poster_url = models.URLField()
    backdrop_url = models.URLField()
    trailer_url = models.URLField(blank=True, help_text="YouTube embed URL")
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "title"]

    def __str__(self):
        return self.title


class MyListItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="my_list")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "movie")
        ordering = ["-added_at"]
