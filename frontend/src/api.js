// Fetch wrapper: adds the auth token, throws readable errors (err.status is the HTTP code).
async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Token ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const first = Object.values(data)[0];
    const err = new Error(Array.isArray(first) ? first[0] : data.detail || "Something went wrong.");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  login: (username, password) => request("/auth/login/", { method: "POST", body: { username, password } }),
  register: (username, password) => request("/auth/register/", { method: "POST", body: { username, password } }),
  movies: () => request("/movies/"),
  me: (token) => request("/me/", { token }),
  toggleMyList: (token, movie_id) => request("/mylist/", { method: "POST", token, body: { movie_id } }),
  progress: (token) => request("/progress/", { token }),
  saveProgress: (token, movie_id, seconds, duration) =>
    request("/progress/", { method: "POST", token, body: { movie_id, seconds, duration } }),
  react: (token, movie_id, value) => request("/react/", { method: "POST", token, body: { movie_id, value } }),
};
