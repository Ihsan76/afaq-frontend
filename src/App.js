import React, { useEffect, useState } from "react";
import "./App.css";
import { createTranslator } from "./i18n";

import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

import { fetchDashboardApi } from "./api";

function App() {
  const [locale, setLocale] = useState("ar");
  const { t, direction } = createTranslator(locale);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  const loadDashboard = async (token) => {
    setLoading(true);
    setError(null);

    const accessToken = token || localStorage.getItem("accessToken");

    try {
      const response = await fetchDashboardApi(accessToken);

      console.log("Response status:", response.status);

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        setData(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("JSON data:", json);
      setData(json);
    } catch (err) {
      console.error("fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const existingToken = localStorage.getItem("accessToken");
    if (existingToken) {
      setIsLoggedIn(true);
      loadDashboard(existingToken);
    }
  }, []);

  const handleLoginSuccess = (access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setIsLoggedIn(true);
    loadDashboard(access);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setData(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="App" style={{ padding: 20, direction }}>
        {t("login.loading")}
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginForm
        t={t}
        direction={direction}
        locale={locale}
        setLocale={setLocale}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  if (error && !data) {
    return (
      <div
        className="App"
        style={{
          padding: 20,
          color: "red",
          direction,
          textAlign: direction === "rtl" ? "right" : "left",
        }}
      >
        {t("login.errorPrefix")} {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="App"
        style={{
          padding: 20,
          direction,
          textAlign: direction === "rtl" ? "right" : "left",
        }}
      >
        {t("dashboard.noData")}
      </div>
    );
  }

  return (
    <Dashboard
      t={t}
      direction={direction}
      locale={locale}
      setLocale={setLocale}
      data={data}
      onLogout={handleLogout}
    />
  );
}

export default App;
