const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
  ? "http://127.0.0.1:8000"          // باك‑إند المحلي
  : "https://sm-app.up.railway.app"; // باك‑إند Railway
