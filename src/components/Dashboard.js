// src/components/Dashboard.js
import React from "react";
import SocialAccountsManager from "./SocialAccountsManager";
import PostsManager from "./PostsManager";

function Dashboard({ t, direction, locale, setLocale, data, onLogout }) {
  const { stats, recent_posts } = data;

  return (
    <div
      className="App"
      style={{
        padding: 20,
        direction,
        textAlign: direction === "rtl" ? "right" : "left",
      }}
    >
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
          style={{ padding: "4px 8px", fontSize: 12 }}
        >
          {locale === "ar" ? "EN" : "AR"}
        </button>

        <button
          onClick={onLogout}
          style={{ padding: "4px 8px", fontSize: 12 }}
        >
          {t("dashboard.logout")}
        </button>
      </div>

      <h1>{t("dashboard.title")}</h1>

      <section style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 8,
            minWidth: 120,
          }}
        >
          <h3>{t("dashboard.statsDraft")}</h3>
          <p style={{ fontSize: 24 }}>{stats.draft}</p>
        </div>
        <div
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 8,
            minWidth: 120,
          }}
        >
          <h3>{t("dashboard.statsScheduled")}</h3>
          <p style={{ fontSize: 24 }}>{stats.scheduled}</p>
        </div>
        <div
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 8,
            minWidth: 120,
          }}
        >
          <h3>{t("dashboard.statsPublished")}</h3>
          <p style={{ fontSize: 24 }}>{stats.published}</p>
        </div>
      </section>

      {/* إدارة المنشورات */}
      
      <PostsManager t={t} direction={direction} recentPosts={recent_posts  || []} />

      {/* إدارة حسابات السوشال */}
      <SocialAccountsManager t={t} direction={direction} />
    </div>
  );
}

export default Dashboard;
