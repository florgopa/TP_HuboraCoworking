export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  return fetch(url, { ...options, headers });
}