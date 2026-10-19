// Five bars that fill with the film's tension score.
export default function TensionMeter({ value, label = false }) {
  return (
    <span className="tension" role="img" aria-label={`Tension ${value} out of 5`}>
      <span className="bars">
        {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= value ? "on" : ""} />)}
      </span>
      {label && <span className="tension-label">Tension {value}/5</span>}
    </span>
  );
}
