export default function Hero({ movie, saved, onPlay, onToggle }) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${movie.backdrop_url})` }}>
      <div className="hero-fade">
        <h1>{movie.title}</h1>
        <p className="meta">{movie.year} · {movie.rating} · {movie.duration_min} min · {movie.genre}</p>
        <p className="desc">{movie.description}</p>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => onPlay(movie)}>▶ Play</button>
          <button className="btn btn-ghost" onClick={() => onToggle(movie)}>
            {saved ? "✓ In My List" : "+ Add to My List"}
          </button>
        </div>
      </div>
    </section>
  );
}
