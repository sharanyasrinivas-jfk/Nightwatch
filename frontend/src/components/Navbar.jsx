import { useEffect, useState } from "react";

export default function Navbar({ username, view, setView, query, setQuery, onLogout }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${solid ? "solid" : ""}`}>
      <div className="nav-group">
        <span className="logo">Nightwatch</span>
        <nav aria-label="Main">
          <button className={view === "browse" ? "active" : ""} onClick={() => setView("browse")}>Browse</button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>My List</button>
        </nav>
      </div>
      <div className="nav-group">
        <input type="search" placeholder="Title, director or cast" value={query} aria-label="Search"
               onChange={(e) => { setQuery(e.target.value); setView("browse"); }} />
        <span className="muted user">{username}</span>
        <button className="link" onClick={onLogout}>Sign out</button>
      </div>
    </header>
  );
}
