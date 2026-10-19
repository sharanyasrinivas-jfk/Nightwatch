# Nightwatch – a thrillers-only streaming app (React + Django)

Original placeholder artwork and fictional titles – no Netflix assets.

## Features
- Six thriller styles: Psychological, Crime, Mystery, Neo-Noir, Spy, Survival
- **Tension meter** (1–5) on every film, plus sort by tension / newest / most watched
- Rotating hero spotlight, **Top 10 this week**, "Edge of your seat" shelf
- **Continue watching** – built-in video player saves and resumes your position
- My List, thumbs up/down, "more like this", search (title, director, cast)
- Token login/register, loading skeletons, toasts, responsive, keyboard accessible

## Stack
React 18 + Vite · Django 5 + Django REST Framework · SQLite · Git

## Run the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations movies
python manage.py migrate
python manage.py seed
python manage.py runserver          # http://localhost:8000
```
Optional: `python manage.py createsuperuser`, then add films at /admin.
Run tests: `python manage.py test`

## Run the frontend
```bash
cd frontend
npm install
npm run dev                         # http://localhost:5173
```

## API
| Method | URL | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register/, /api/auth/login/ | no | returns `{token, username}` |
| GET | /api/movies/?q=&subgenre=&sort=tension\|new\|top&limit= | no | catalogue |
| GET | /api/me/ | yes | saved ids + reactions |
| GET/POST | /api/mylist/ | yes | list / toggle `{movie_id}` |
| GET/POST | /api/progress/ | yes | continue watching / save `{movie_id, seconds, duration}` |
| POST | /api/react/ | yes | `{movie_id, value: 1 \| -1 \| 0}` |

## Using your own videos and posters
In `/admin`, edit a Movie and set **Video url** to a direct `.mp4` link and the poster/backdrop URLs.
Only use video and images you have the rights to.

## Git
```bash
git remote add origin <your-repo-url>
git push -u origin main
```
