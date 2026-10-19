import { useEffect, useState } from "react";

export default function Navbar({ username, view, setView, query, setQuery, onLogout }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${solid ? "solid" : ""}`}>
      <div className="nav-left">
        <span className="logo">STREAMFLIX</span>
        <nav>
          <button className={view === "home" ? "active" : ""} onClick={() => setView("home")}>Home</button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>My List</button>
        </nav>
      </div>
      <div className="nav-right">
        <input type="search" placeholder="Search titles" value={query}
               onChange={(e) => { setQuery(e.target.value); setView("home"); }} aria-label="Search titles" />
        <span className="user">{username}</span>
        <button className="link" onClick={onLogout}>Sign out</button>
      </div>
    </header>
  );
}
