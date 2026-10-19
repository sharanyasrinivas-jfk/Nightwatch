import { useEffect, useState } from "react";

export default function MovieModal({ movie, saved, onToggle, onClose }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={movie.title} onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-media" style={{ backgroundImage: playing ? "none" : `url(${movie.backdrop_url})` }}>
          {playing && movie.trailer_url
            ? <iframe src={`${movie.trailer_url}?autoplay=1`} title={movie.title} allow="autoplay; encrypted-media" allowFullScreen />
            : <div className="modal-fade"><h2>{movie.title}</h2>
                <div className="actions">
                  <button className="btn btn-primary" onClick={() => setPlaying(true)}>▶ Play trailer</button>
                  <button className="btn btn-ghost" onClick={() => onToggle(movie)}>{saved ? "✓ In My List" : "+ Add to My List"}</button>
                </div>
              </div>}
        </div>
        <div className="modal-body">
          <p className="meta">{movie.year} · {movie.rating} · {movie.duration_min} min</p>
          <p>{movie.description}</p>
          <p className="genre">Genre: {movie.genre}</p>
        </div>
      </div>
    </div>
  );
}
