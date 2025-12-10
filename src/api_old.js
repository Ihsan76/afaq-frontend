//
import { API_BASE_URL } from "./config";

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response;
}

export async function fetchDashboardApi(token) {
  const response = await fetch(`${API_BASE_URL}/api/mahwar/dashboard/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response;
}
