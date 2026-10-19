from django.contrib import admin
from .models import Movie, MyListItem

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("title", "genre", "year", "featured")
    list_filter = ("genre", "featured")
    search_fields = ("title",)

admin.site.register(MyListItem)
