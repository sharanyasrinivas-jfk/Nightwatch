# StreamFlix – Netflix Clone (React + Django)

Full-stack streaming-site clone for learning. **Original placeholder artwork only** – no Netflix assets.

| Layer    | Tech                                              |
|----------|---------------------------------------------------|
| Frontend | HTML, CSS, JavaScript (async/await), React 18 + hooks, Vite |
| Backend  | Python, Django 5, Django REST Framework, Token auth |
| Database | SQLite (default)                                  |
| Tooling  | Git                                               |

## Features
- Register / login (token authentication)
- Hero banner + genre rows (horizontal scroll)
- Search and genre filter
- Movie details modal with trailer player
- "My List" saved per user
- Responsive layout (mobile → desktop)

## Run the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed           # loads sample movies
python manage.py createsuperuser  # optional, for /admin
python manage.py runserver      # http://localhost:8000
```

## Run the frontend
```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173 (proxies /api to :8000)
```

## API
| Method | URL                    | Auth | Purpose                      |
|--------|------------------------|------|------------------------------|
| POST   | /api/auth/register/    | no   | `{username,password}` → token |
| POST   | /api/auth/login/       | no   | `{username,password}` → token |
| GET    | /api/movies/?q=&genre= | no   | list / search movies         |
| GET    | /api/mylist/           | yes  | my saved movies              |
| POST   | /api/mylist/           | yes  | `{movie_id}` toggles save    |

## Git workflow
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
Use feature branches (`git checkout -b feature/search`) and small commits.

## Project structure
```
backend/   Django project (netflix_backend) + app (movies)
frontend/  React app (src/components, src/pages)
```

## Next steps
Add tests, pagination, profiles, real video hosting, Docker, CI.
