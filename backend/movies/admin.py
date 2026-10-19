from django.contrib import admin
from .models import Movie, MyListItem, WatchProgress, Reaction


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("title", "subgenre", "year", "tension", "views", "featured")
    list_filter = ("subgenre", "featured", "tension")
    search_fields = ("title", "director", "cast")


admin.site.register([MyListItem, WatchProgress, Reaction])
