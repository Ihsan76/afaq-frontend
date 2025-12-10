import React, { useState } from "react";
import { login } from "../api";

function LoginForm({ t, direction, locale, setLocale, onSuccess, initialUsername = "ihsan" }) {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(username, password);

      if (!response.ok) {
        throw new Error(`${t("login.errorPrefix")} ${response.status}`);
      }

      const json = await response.json();
      onSuccess(json.access, json.refresh);
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="App"
      style={{ padding: 20, direction, textAlign: direction === "rtl" ? "right" : "left" }}
    >
      <div style={{ marginBottom: 16, display: "flex", justifyContent: direction === "rtl" ? "flex-start" : "flex-end" }}>
        <button
          onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
          style={{ padding: "4px 8px", fontSize: 12 }}
        >
          {locale === "ar" ? "EN" : "AR"}
        </button>
      </div>

      <h1>{t("login.title")}</h1>

      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
        <div style={{ marginBottom: 12 }}>
          <label>{t("login.username")}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>{t("login.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          {loading ? t("login.loading") : t("login.submit")}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
