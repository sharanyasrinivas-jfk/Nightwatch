from django.test import TestCase
from rest_framework.test import APIClient
from .models import Movie


class ApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.a = Movie.objects.create(title="Alpha", description="d", subgenre="Crime", tension=2, year=2020,
                                      poster_url="https://x.test/p.jpg", backdrop_url="https://x.test/b.jpg")
        self.b = Movie.objects.create(title="Beta", description="d", subgenre="Spy", tension=5, year=2024,
                                      poster_url="https://x.test/p.jpg", backdrop_url="https://x.test/b.jpg")

    def login(self, name="ann"):
        token = self.client.post("/api/auth/register/", {"username": name, "password": "secret1"}).json()["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    def test_register_login_duplicate(self):
        self.assertEqual(self.client.post("/api/auth/register/", {"username": "ann", "password": "secret1"}).status_code, 201)
        self.assertEqual(self.client.post("/api/auth/register/", {"username": "ANN", "password": "secret1"}).status_code, 400)
        self.assertEqual(self.client.post("/api/auth/login/", {"username": "ann", "password": "nope123"}).status_code, 400)

    def test_filter_and_sort(self):
        self.assertEqual(len(self.client.get("/api/movies/?subgenre=spy").json()), 1)
        self.assertEqual(self.client.get("/api/movies/?sort=tension").json()[0]["title"], "Beta")
        self.assertEqual(len(self.client.get("/api/movies/?limit=1").json()), 1)

    def test_my_list_toggle(self):
        self.login()
        self.assertTrue(self.client.post("/api/mylist/", {"movie_id": self.a.id}).json()["saved"])
        self.assertEqual(self.client.get("/api/me/").json()["saved"], [self.a.id])
        self.assertFalse(self.client.post("/api/mylist/", {"movie_id": self.a.id}).json()["saved"])

    def test_progress_continue_watching_and_views(self):
        self.login()
        self.client.post("/api/progress/", {"movie_id": self.a.id, "seconds": 60, "duration": 600})
        self.assertEqual(len(self.client.get("/api/progress/").json()), 1)
        self.a.refresh_from_db()
        self.assertEqual(self.a.views, 1)
        self.client.post("/api/progress/", {"movie_id": self.a.id, "seconds": 599, "duration": 600})
        self.assertEqual(self.client.get("/api/progress/").json(), [])   # finished -> hidden

    def test_reaction(self):
        self.login()
        self.client.post("/api/react/", {"movie_id": self.a.id, "value": 1}, format="json")
        self.assertEqual(self.client.get("/api/me/").json()["reactions"], {str(self.a.id): 1})
        self.assertEqual(self.client.post("/api/react/", {"movie_id": self.a.id, "value": 7}, format="json").status_code, 400)

    def test_requires_auth(self):
        self.assertEqual(self.client.get("/api/mylist/").status_code, 401)
