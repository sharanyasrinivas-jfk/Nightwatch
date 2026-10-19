import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Row, { Grid } from "../components/Row.jsx";
import MovieModal from "../components/MovieModal.jsx";
import Player from "../components/Player.jsx";

const SUBGENRES = ["Psychological", "Crime", "Mystery", "Neo-Noir", "Spy", "Survival"];
const SORTS = [["featured", "Recommended"], ["tension", "Highest tension"], ["new", "Newest"], ["top", "Most watched"]];
const COMPARE = {
  tension: (a, b) => b.tension - a.tension || b.views - a.views,
  new: (a, b) => b.year - a.year,
  top: (a, b) => b.views - a.views,
};

export default function Home({ session, onLogout }) {
  const { token } = session;
  const [all, setAll] = useState([]);
  const [status, setStatus] = useState("loading");
  const [saved, setSaved] = useState(new Set());
  const [reactions, setReactions] = useState({});
  const [resume, setResume] = useState([]);          // [{movie, seconds, duration}]
  const [view, setView] = useState("browse");        // browse | list
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [toast, setToast] = useState("");

  const flash = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); }, []);
  const fail = useCallback((err) => (err.status === 401 ? onLogout() : flash(err.message)), [onLogout, flash]);

  useEffect(() => {
    Promise.all([api.movies(), api.me(token), api.progress(token)])
      .then(([movies, me, progress]) => {
        setAll(movies);
        setSaved(new Set(me.saved));
        setReactions(me.reactions);
        setResume(progress);
        setStatus("ready");
      })
      .catch((err) => (err.status === 401 ? onLogout() : setStatus("error")));
  }, [token]);

  const resumeAt = (m) => resume.find((r) => r.movie.id === m.id)?.seconds || 0;
  const progressOf = (m) => { const r = resume.find((x) => x.movie.id === m.id); return r ? r.seconds / r.duration : null; };

  async function toggleSaved(movie) {
    const was = saved.has(movie.id);
    const flip = (s) => { const n = new Set(s); was ? n.delete(movie.id) : n.add(movie.id); return n; };
    setSaved(flip);
    try { await api.toggleMyList(token, movie.id); flash(was ? "Removed from My List" : "Added to My List"); }
    catch (err) { setSaved(flip); fail(err); }   // flip again = undo
  }

  async function react(movie, value) {
    const next = reactions[movie.id] === value ? 0 : value;
    setReactions((r) => ({ ...r, [movie.id]: next }));
    try { await api.react(token, movie.id, next); } catch (err) { fail(err); }
  }

  const saveProgress = (movie, sec, dur) => api.saveProgress(token, movie.id, sec, dur).catch(() => {});
  const closePlayer = () => { setPlaying(null); api.progress(token).then(setResume).catch(() => {}); };
  const play = (m) => { setSelected(null); setPlaying(m); };

  // ----- derived lists -----
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = all.filter((m) =>
      (genre === "All" || m.subgenre === genre) &&
      (!q || `${m.title} ${m.description} ${m.director} ${m.cast}`.toLowerCase().includes(q)));
    return COMPARE[sort] ? [...list].sort(COMPARE[sort]) : list;
  }, [all, query, genre, sort]);

  const filtering = query !== "" || genre !== "All" || sort !== "featured";
  const featured = all.filter((m) => m.featured);
  const top10 = useMemo(() => [...all].sort(COMPARE.top).slice(0, 10), [all]);
  const edge = all.filter((m) => m.tension === 5);
  const related = selected ? all.filter((m) => m.subgenre === selected.subgenre && m.id !== selected.id).slice(0, 6) : [];
  const showHero = view === "browse" && !filtering && featured.length > 0 && status === "ready";

  return (
    <>
      <Navbar username={session.username} view={view} setView={setView} query={query} setQuery={setQuery} onLogout={onLogout} />

      {status === "error" && <p className="notice">Can't reach the server. Start the Django backend on port 8000, then refresh.</p>}
      {showHero && (
        <Hero movies={featured} saved={saved} resumeAt={resumeAt} onPlay={play} onInfo={setSelected} onToggle={toggleSaved} />
      )}

      <main className={`page ${showHero ? "" : "no-hero"}`}>
        {view === "browse" && (
          <div className="toolbar">
            <div className="chips" role="group" aria-label="Filter by style">
              {["All", ...SUBGENRES].map((g) => (
                <button key={g} className={genre === g ? "on" : ""} onClick={() => setGenre(g)}>{g}</button>
              ))}
            </div>
            <label className="sort">Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          </div>
        )}

        {status === "loading" && <div className="skeleton-row">{Array.from({ length: 7 }, (_, i) => <div key={i} />)}</div>}

        {status === "ready" && view === "list" && (
          <>
            <h2 className="page-title">My List</h2>
            {saved.size === 0
              ? <p className="notice">Nothing saved yet. Open a title and choose + My List.</p>
              : <Grid items={all.filter((m) => saved.has(m.id))} onSelect={setSelected} />}
          </>
        )}

        {status === "ready" && view === "browse" && (filtering ? (
          results.length
            ? <Grid items={results} onSelect={setSelected} />
            : <p className="notice">No thrillers match that. Try another style or clear the search.</p>
        ) : (
          <>
            <Row title="Continue watching" items={resume.map((r) => r.movie)} progressOf={progressOf} onSelect={setSelected} />
            <Row title="Top 10 this week" items={top10} ranked onSelect={setSelected} />
            <Row title="Edge of your seat" items={edge} onSelect={setSelected} />
            {SUBGENRES.map((g) => <Row key={g} title={g} items={all.filter((m) => m.subgenre === g)} onSelect={setSelected} />)}
          </>
        ))}
      </main>

      {selected && (
        <MovieModal movie={selected} related={related} saved={saved.has(selected.id)} reaction={reactions[selected.id]}
                    resumeAt={resumeAt} onPlay={play} onToggle={toggleSaved} onReact={react}
                    onSelect={setSelected} onClose={() => setSelected(null)} />
      )}
      {playing && <Player movie={playing} startAt={resumeAt(playing)} onSave={saveProgress} onClose={closePlayer} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
