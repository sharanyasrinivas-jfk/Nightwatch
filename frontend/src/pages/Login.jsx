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
      const data = await (mode === "login" ? api.login : api.register)(username, password);
      onAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <div className="auth-brand">STREAMFLIX</div>
      <form className="auth-card" onSubmit={submit}>
        <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>
        {error && <p className="error" role="alert">{error}</p>}
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                 required autoComplete={mode === "login" ? "current-password" : "new-password"} />
        </label>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Sign up"}
        </button>
        <p className="switch">
          {mode === "login" ? "New here?" : "Already a member?"}{" "}
          <button type="button" className="link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </form>
    </main>
  );
}
