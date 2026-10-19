// Small fetch wrapper: adds the auth token and throws readable errors.
async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const first = Object.values(data)[0];
    throw new Error(Array.isArray(first) ? first[0] : data.detail || "Something went wrong.");
  }
  return data;
}

export const api = {
  login: (username, password) => request("/auth/login/", { method: "POST", body: { username, password } }),
  register: (username, password) => request("/auth/register/", { method: "POST", body: { username, password } }),
  movies: (params = {}) => request(`/movies/?${new URLSearchParams(params)}`),
  myList: (token) => request("/mylist/", { token }),
  toggleMyList: (token, movie_id) => request("/mylist/", { method: "POST", token, body: { movie_id } }),
};
