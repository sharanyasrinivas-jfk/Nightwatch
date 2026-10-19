import { useEffect, useState } from "react";
import TensionMeter from "./TensionMeter.jsx";

// Rotating spotlight. Pauses while the pointer is over it.
export default function Hero({ movies, saved, resumeAt, onPlay, onInfo, onToggle }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const movie = movies[i % movies.length];

  useEffect(() => {
    if (paused || movies.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % movies.length), 9000);
    return () => clearInterval(t);
  }, [paused, movies.length]);

  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div key={movie.id} className="hero-bg" style={{ backgroundImage: `url(${movie.backdrop_url})` }} />
      <div className="hero-content">
        <p className="tagline">{movie.tagline}</p>
        <h1>{movie.title}</h1>
        <p className="meta">{movie.year} · {movie.rating} · {movie.duration_min} min · {movie.subgenre}</p>
        <TensionMeter value={movie.tension} label />
        <p className="desc">{movie.description}</p>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => onPlay(movie)}>{resumeAt(movie) ? "Resume" : "Play"}</button>
          <button className="btn btn-ghost" onClick={() => onInfo(movie)}>Details</button>
          <button className="btn btn-ghost" onClick={() => onToggle(movie)}>{saved.has(movie.id) ? "✓ In My List" : "+ My List"}</button>
        </div>
      </div>
      {movies.length > 1 && (
        <div className="dots">
          {movies.map((m, n) => (
            <button key={m.id} className={n === i % movies.length ? "on" : ""} onClick={() => setI(n)} aria-label={`Show ${m.title}`} />
          ))}
        </div>
      )}
    </section>
  );
}
