import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Row from "../components/Row.jsx";
import MovieModal from "../components/MovieModal.jsx";

export default function Home({ session, onLogout }) {
  const { token } = session;
  const [movies, setMovies] = useState([]);
  const [saved, setSaved] = useState([]);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("home"); // home | list
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading");

  // Load saved list once
  useEffect(() => {
    api.myList(token).then(setSaved).catch(() => onLogout());
  }, [token]);

  // Load movies, debounced search
  useEffect(() => {
    setStatus("loading");
    const t = setTimeout(() => {
      api.movies(query ? { q: query } : {})
        .then((d) => { setMovies(d); setStatus("ready"); })
        .catch(() => setStatus("error"));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const savedIds = useMemo(() => new Set(saved.map((m) => m.id)), [saved]);

  async function toggleSaved(movie) {
    await api.toggleMyList(token, movie.id);
    setSaved(await api.myList(token));
  }

  const source = view === "list" ? saved : movies;
  const genres = useMemo(() => {
    const map = {};
    source.forEach((m) => (map[m.genre] ||= []).push(m));
    return Object.entries(map);
  }, [source]);
  const featured = movies.find((m) => m.featured) || movies[0];

  return (
    <>
      <Navbar username={session.username} view={view} setView={setView}
              query={query} setQuery={setQuery} onLogout={onLogout} />
      {status === "error" && <p className="notice">Can't reach the server. Is the Django backend running on port 8000?</p>}
      {view === "home" && !query && featured && (
        <Hero movie={featured} saved={savedIds.has(featured.id)} onPlay={setSelected} onToggle={toggleSaved} />
      )}
      <main className="rows" style={{ paddingTop: view === "list" || query ? "6rem" : 0 }}>
        {view === "list" && <h2 className="page-title">My List</h2>}
        {status === "ready" && source.length === 0 && (
          <p className="notice">{view === "list" ? "Nothing saved yet. Open a title and choose Add to My List." : "No titles match your search."}</p>
        )}
        {genres.map(([genre, items]) => (
          <Row key={genre} title={genre} movies={items} onSelect={setSelected} />
        ))}
      </main>
      {selected && (
        <MovieModal movie={selected} saved={savedIds.has(selected.id)}
                    onToggle={toggleSaved} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
