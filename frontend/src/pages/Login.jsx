import { useState } from "react";
import { api } from "../api.js";

export default function Login({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onAuth(await (mode === "login" ? api.login : api.register)(username, password));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const login = mode === "login";
  return (
    <main className="auth">
      <span className="logo auth-logo">Nightwatch</span>
      <section className="auth-card">
        <h1>{login ? "Welcome back." : "Join the watch."}</h1>
        <p className="muted">{login ? "Sign in to pick up where you left off." : "Thrillers only. Lights low."}</p>
        <form onSubmit={submit}>
          {error && <p className="error" role="alert">{error}</p>}
          <label>Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
          </label>
          <label>Password
            <input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required
                   autoComplete={login ? "current-password" : "new-password"} />
          </label>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "One moment…" : login ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="muted">
          {login ? "New here?" : "Already a member?"}{" "}
          <button className="link" onClick={() => { setMode(login ? "register" : "login"); setError(""); }}>
            {login ? "Create an account" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}
