from django.core.management.base import BaseCommand
from movies.models import Movie

# Sample video used for every title so the player works out of the box.
# Replace Movie.video_url in /admin with your own .mp4 links.
VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

# (title, tagline, subgenre, director, cast, tension, description)
DATA = [
    ("The Tenant Below", "Someone is living in the walls.", "Psychological", "Ines Calder", "Maren Voss, Tobias Reyne", 4,
     "A night-shift nurse hears footsteps under her floor, in a building that has no basement."),
    ("Mirror Hours", "Every reflection runs a minute behind.", "Psychological", "Daniel Okafor", "Lena Ashby, Corin Hale", 5,
     "A sleep researcher begins to see her reflection act before she does."),
    ("Quiet Room", "Therapy works both ways.", "Psychological", "Priya Nandakumar", "Hollis Grey, Mara Quinn", 3,
     "A therapist realises her newest patient knows things about her life she never shared."),
    ("Ash Ledger", "Every debt gets collected.", "Crime", "Marcus Veil", "Roan Teague, Isla Brandt", 4,
     "A port syndicate's bookkeeper skims one shipment too many and has 48 hours to repay it."),
    ("Cold Harbor Nine", "Nine robberies. One pattern.", "Crime", "Yusuf Marlow", "Dana Whitlock, Remy Castellan", 3,
     "A detective in her final week connects nine heists nobody else sees as one."),
    ("The Long Alibi", "Perfect on paper.", "Crime", "Sofia Reinholt", "Gideon Pratt, Noor Elbaz", 3,
     "A man with an airtight alibi for a murder begins to doubt it himself."),
    ("The Lantern Keepers", "One night is missing from the log.", "Mystery", "Arlo Finch", "Edda Moss, Callum Rhodes", 3,
     "Two investigators reach a tidal island and find a lighthouse log with a single night torn out."),
    ("Nine Floors Down", "The lift stops where there is no button.", "Mystery", "Teodora Vance", "Ilya Brandt, Wren Okoye", 4,
     "A maintenance engineer follows an elevator to a floor that is not on any blueprint."),
    ("Paper Moon Hotel", "Checkout is not guaranteed.", "Mystery", "Henrik Salo", "Odette Marsh, Felix Arden", 2,
     "An inspector checks in to a grand hotel whose ledger lists her as a returning guest."),
    ("Rain Over Kestrel Street", "The city keeps its own books.", "Neo-Noir", "Lucian Ward", "Mara Sinclair, Jonah Pike", 3,
     "A disgraced reporter trades one favour for a story that names half the city council."),
    ("Velvet Static", "A voice on the radio knows your name.", "Neo-Noir", "Corinne Abara", "Silas Dunmore, Pia Laurent", 4,
     "A late-night DJ takes a caller's request and hears a confession instead."),
    ("Blue Hour Exit", "Leave before the lights change.", "Neo-Noir", "Marta Quill", "Evan Roque, Tess Holloway", 3,
     "A getaway driver has until dawn to find who sold out the crew."),
    ("Dead Drop Protocol", "Trust nobody with a pulse.", "Spy", "Viktor Hale", "Anya Brecht, Leo Strand", 4,
     "A retired courier is pulled back to recover a package that does not exist."),
    ("Embassy of Ghosts", "Every diplomat is somebody's asset.", "Spy", "Noor Haddad", "Julian Frost, Mina Okonkwo", 4,
     "During a state visit, a translator realises one delegate is repeating her words to someone else."),
    ("The Cipher Winter", "Break the code before the thaw.", "Spy", "Gerd Lindqvist", "Hana Vos, Dmitri Carr", 3,
     "A codebreaker hidden in a snowbound station intercepts a message addressed to her."),
    ("Whiteout Line", "Forty miles. No road. No signal.", "Survival", "Kara Lindholm", "Tomas Bright, Alba Reyes", 5,
     "After a crash on a glacier, three strangers must reach a ridge before the storm closes it."),
    ("Below the Tideline", "The water rises on schedule.", "Survival", "Owen Ashgrove", "Nia Calloway, Raf Delmar", 4,
     "Divers trapped in a sea cave work out that the tide is not the only thing counting down."),
    ("Black Pines", "Do not follow the lights.", "Survival", "Ingrid Solheim", "Cole Maddox, Yara Fenn", 5,
     "A hiking group realises the trail markers have been moved on purpose."),
]


class Command(BaseCommand):
    help = "Load sample thriller movies (placeholder artwork from picsum.photos)"

    def handle(self, *args, **opts):
        Movie.objects.all().delete()
        for i, (title, tagline, sub, director, cast, tension, desc) in enumerate(DATA):
            slug = title.lower().replace(" ", "-")
            Movie.objects.create(
                title=title, tagline=tagline, subgenre=sub, director=director, cast=cast,
                tension=tension, description=desc,
                year=2019 + i % 8, rating="R" if tension >= 4 else "PG-13", duration_min=92 + (i * 5) % 40,
                poster_url=f"https://picsum.photos/seed/{slug}/300/450",
                backdrop_url=f"https://picsum.photos/seed/{slug}-bg/1280/720",
                video_url=VIDEO, featured=(i in (1, 15, 12, 9)),
                views=5000 + (i * 7919) % 4000,
            )
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(DATA)} thrillers"))
