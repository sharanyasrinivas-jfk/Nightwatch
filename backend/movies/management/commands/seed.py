from django.core.management.base import BaseCommand
from movies.models import Movie

TRAILER = "https://www.youtube.com/embed/aqz-KE-bpKQ"  # Blender open movie "Big Buck Bunny"

DATA = [
    ("Neon Harbor", "Action", "A courier races across a flooded megacity to deliver a message that could end a war."),
    ("Iron Meridian", "Action", "Rival crews chase a stolen train carrying the last working reactor core."),
    ("Last Light Protocol", "Action", "An ex-pilot has one night to ground a rogue fleet before sunrise."),
    ("The Quiet Orchard", "Drama", "Three siblings return to the family farm and unearth a decades-old secret."),
    ("Paper Lanterns", "Drama", "A street-food cook and a retired violinist build an unlikely friendship."),
    ("Salt & Distance", "Drama", "A long-distance couple tests how far letters can carry a love story."),
    ("Moonlit Detour", "Comedy", "A wrong turn on a road trip turns into the worst, funniest wedding weekend."),
    ("Office of Small Wonders", "Comedy", "A mailroom team accidentally becomes the city's secret good-news agency."),
    ("Dinner for Eleven", "Comedy", "Everything that can go wrong at a family dinner does, in real time."),
    ("Signal Lost", "Sci-Fi", "A deep-space crew hears its own voice on a channel that shouldn't exist."),
    ("Terraform", "Sci-Fi", "Colonists on Mars discover the soil has been waiting for them."),
    ("Orbit of Glass", "Sci-Fi", "A station librarian finds a book that rewrites itself every orbit."),
    ("Hollow Pines", "Thriller", "A search-and-rescue volunteer realizes the missing hiker is a decoy."),
    ("Midnight Ledger", "Thriller", "An auditor follows the numbers into a conspiracy that follows back."),
    ("Glass Alibi", "Thriller", "Every witness saw something different, and each one is telling the truth."),
]


class Command(BaseCommand):
    help = "Load sample movies (placeholder artwork from picsum.photos)"

    def handle(self, *args, **opts):
        Movie.objects.all().delete()
        for i, (title, genre, desc) in enumerate(DATA):
            seed = title.lower().replace(" ", "-").replace("&", "and")
            Movie.objects.create(
                title=title, genre=genre, description=desc,
                year=2018 + i % 8, rating=["PG", "PG-13", "R"][i % 3], duration_min=88 + i * 4,
                poster_url=f"https://picsum.photos/seed/{seed}/300/450",
                backdrop_url=f"https://picsum.photos/seed/{seed}-bg/1280/720",
                trailer_url=TRAILER, featured=(i == 0),
            )
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(DATA)} movies"))
