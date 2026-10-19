from django.urls import path
from . import views

urlpatterns = [
    path("auth/register/", views.register),
    path("auth/login/", views.login),
    path("movies/", views.MovieList.as_view()),
    path("me/", views.me),
    path("mylist/", views.my_list),
    path("progress/", views.progress),
    path("react/", views.react),
]
