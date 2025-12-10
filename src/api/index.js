// src/api/index.js
import { API_BASE_URL } from "../config";

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

// جلب حسابات السوشال
export async function fetchSocialAccounts(token) {
  const response = await fetch(`${API_BASE_URL}/api/mahwar/social-accounts/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response;
}

// إنشاء حساب سوشال جديد
export async function createSocialAccount(token, payload) {
  const response = await fetch(`${API_BASE_URL}/api/mahwar/social-accounts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });
  return response;
}
export async function deleteSocialAccount(token, id) {
  const response = await fetch(`${API_BASE_URL}/api/mahwar/social-accounts/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response;
}
export async function updateSocialAccount(token, id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/mahwar/social-accounts/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });
  return response;
}
