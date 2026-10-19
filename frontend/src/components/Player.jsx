import { useEffect, useRef } from "react";

// Full-screen player. Saves progress every 5 s and on pause/close so "Continue watching" works.
export default function Player({ movie, startAt, onSave, onClose }) {
  const video = useRef(null);
  const last = useRef(0);

  const save = (force) => {
    const v = video.current;
    if (!v || !v.duration) return;
    const now = Date.now();
    if (!force && now - last.current < 5000) return;
    last.current = now;
    onSave(movie, v.currentTime, v.duration);
  };
  const close = () => { save(true); onClose(); };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  });

  return (
    <div className="player">
      <div className="player-bar">
        <button className="btn btn-ghost" onClick={close}>← Back</button>
        <span>{movie.title}</span>
      </div>
      {movie.video_url ? (
        <video ref={video} src={movie.video_url} controls autoPlay playsInline
               onLoadedMetadata={(e) => { if (startAt > 0 && startAt < e.target.duration - 10) e.target.currentTime = startAt; }}
               onTimeUpdate={() => save(false)} onPause={() => save(true)} />
      ) : (
        <p className="notice">No video is linked to this title yet. Add a video URL in the admin panel.</p>
      )}
    </div>
  );
}
