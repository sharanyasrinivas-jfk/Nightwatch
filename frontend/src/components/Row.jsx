import { useRef } from "react";
import Card from "./Card.jsx";

// One horizontally scrolling shelf. `ranked` draws big 1-10 numerals (Top 10).
export default function Row({ title, items, onSelect, ranked = false, progressOf }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });
  if (!items.length) return null;

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row-wrap">
        <button className="arrow left" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`}>‹</button>
        <div className="row-track" ref={ref}>
          {items.map((m, i) => (
            <div key={m.id} className={ranked ? "ranked" : "slot"}>
              {ranked && <span className="rank" aria-hidden="true">{i + 1}</span>}
              <Card movie={m} onSelect={onSelect} progress={progressOf?.(m)} />
            </div>
          ))}
        </div>
        <button className="arrow right" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`}>›</button>
      </div>
    </section>
  );
}

export function Grid({ items, onSelect }) {
  return (
    <div className="grid">
      {items.map((m) => <Card key={m.id} movie={m} onSelect={onSelect} />)}
    </div>
  );
}
