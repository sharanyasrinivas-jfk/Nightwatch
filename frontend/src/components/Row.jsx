import { useRef } from "react";

export default function Row({ title, movies, onSelect }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row-wrap">
        <button className="arrow left" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`}>‹</button>
        <div className="row-track" ref={ref}>
          {movies.map((m) => (
            <button key={m.id} className="card" onClick={() => onSelect(m)} aria-label={m.title}>
              <img src={m.poster_url} alt={m.title} loading="lazy" />
            </button>
          ))}
        </div>
        <button className="arrow right" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`}>›</button>
      </div>
    </section>
  );
}
