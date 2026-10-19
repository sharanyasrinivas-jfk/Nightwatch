import TensionMeter from "./TensionMeter.jsx";

export default function Card({ movie, onSelect, progress }) {
  return (
    <button className="card" onClick={() => onSelect(movie)} aria-label={`${movie.title}, ${movie.subgenre}`}>
      <img src={movie.poster_url} alt="" loading="lazy" />
      {progress != null && <span className="progress"><i style={{ width: `${Math.round(progress * 100)}%` }} /></span>}
      <span className="peek">
        <strong>{movie.title}</strong>
        <TensionMeter value={movie.tension} />
        <small>{movie.year} · {movie.subgenre}</small>
      </span>
    </button>
  );
}
