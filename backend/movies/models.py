from django.conf import settings
from django.db import models


class Movie(models.Model):
    SUBGENRES = [
        ("Psychological", "Psychological"), ("Crime", "Crime"), ("Mystery", "Mystery"),
        ("Neo-Noir", "Neo-Noir"), ("Spy", "Spy"), ("Survival", "Survival"),
    ]
    title = models.CharField(max_length=200)
    tagline = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    subgenre = models.CharField(max_length=30, choices=SUBGENRES, db_index=True)
    year = models.PositiveIntegerField(default=2024)
    rating = models.CharField(max_length=10, default="R")
    duration_min = models.PositiveIntegerField(default=100)
    director = models.CharField(max_length=120, blank=True)
    cast = models.CharField(max_length=300, blank=True)
    tension = models.PositiveSmallIntegerField(default=3, help_text="1 (slow burn) to 5 (edge of your seat)")
    poster_url = models.URLField()
    backdrop_url = models.URLField()
    video_url = models.URLField(blank=True, help_text="Direct .mp4 URL played in the built-in player")
    featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-featured", "-created_at", "title"]

    def __str__(self):
        return self.title


class MyListItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "movie")
        ordering = ["-added_at"]


class WatchProgress(models.Model):
    """Where each user stopped watching (powers Continue Watching)."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seconds = models.FloatField(default=0)
    duration = models.FloatField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "movie")
        ordering = ["-updated_at"]


class Reaction(models.Model):
    """Thumbs up (1) / thumbs down (-1)."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    value = models.SmallIntegerField()

    class Meta:
        unique_together = ("user", "movie")
