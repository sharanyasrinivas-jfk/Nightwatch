import { useEffect } from "react";
import TensionMeter from "./TensionMeter.jsx";
import { Grid } from "./Row.jsx";

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function MovieModal({ movie, related, saved, reaction, resumeAt, onPlay, onToggle, onReact, onSelect, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const at = resumeAt(movie);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={movie.title} onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-media" style={{ backgroundImage: `url(${movie.backdrop_url})` }}>
          <div className="modal-fade">
            <h2>{movie.title}</h2>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => onPlay(movie)}>{at ? `Resume at ${mmss(at)}` : "Play"}</button>
              <button className="btn btn-ghost" onClick={() => onToggle(movie)}>{saved ? "✓ In My List" : "+ My List"}</button>
              <button className={`btn btn-icon ${reaction === 1 ? "on" : ""}`} onClick={() => onReact(movie, 1)} aria-pressed={reaction === 1} aria-label="I liked this">👍</button>
              <button className={`btn btn-icon ${reaction === -1 ? "on" : ""}`} onClick={() => onReact(movie, -1)} aria-pressed={reaction === -1} aria-label="Not for me">👎</button>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-main">
            <p className="tagline">{movie.tagline}</p>
            <p className="meta">{movie.year} · {movie.rating} · {movie.duration_min} min</p>
            <TensionMeter value={movie.tension} label />
            <p>{movie.description}</p>
          </div>
          <dl className="credits">
            <dt>Director</dt><dd>{movie.director}</dd>
            <dt>Cast</dt><dd>{movie.cast}</dd>
            <dt>Style</dt><dd>{movie.subgenre} thriller</dd>
          </dl>
        </div>
        {related.length > 0 && (
          <div className="modal-related">
            <h3>More {movie.subgenre.toLowerCase()} thrillers</h3>
            <Grid items={related} onSelect={onSelect} />
          </div>
        )}
      </div>
    </div>
  );
}
