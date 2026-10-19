from django.test import TestCase
from rest_framework.test import APIClient
from .models import Movie


class ApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.movie = Movie.objects.create(
            title="Test Film", description="d", genre="Drama",
            poster_url="https://x.test/p.jpg", backdrop_url="https://x.test/b.jpg")

    def test_register_and_list(self):
        r = self.client.post("/api/auth/register/", {"username": "ann", "password": "secret1"})
        self.assertEqual(r.status_code, 201)
        self.assertEqual(len(self.client.get("/api/movies/").json()), 1)

    def test_my_list_toggle(self):
        token = self.client.post("/api/auth/register/", {"username": "bob", "password": "secret1"}).json()["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        self.assertTrue(self.client.post("/api/mylist/", {"movie_id": self.movie.id}).json()["saved"])
        self.assertEqual(len(self.client.get("/api/mylist/").json()), 1)
        self.assertFalse(self.client.post("/api/mylist/", {"movie_id": self.movie.id}).json()["saved"])
