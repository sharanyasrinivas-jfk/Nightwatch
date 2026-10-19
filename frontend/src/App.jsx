import { useState } from "react";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("session")); } catch { return null; }
  });

  const save = (s) => {
    if (s) localStorage.setItem("session", JSON.stringify(s));
    else localStorage.removeItem("session");
    setSession(s);
  };

  return session ? <Home session={session} onLogout={() => save(null)} /> : <Login onAuth={save} />;
}
