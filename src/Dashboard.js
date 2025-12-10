import React from "react";

function getStatusLabel(t, status) {
  switch (status) {
    case "draft":
      return t("post.status.draft");
    case "scheduled":
      return t("post.status.scheduled");
    case "published":
      return t("post.status.published");
    default:
      return status;
  }
}

function Dashboard({ t, direction, locale, setLocale, data, onLogout }) {
  const { stats, recent_posts, social_accounts } = data;

  return (
    <div
      className="App"
      style={{ padding: 20, direction, textAlign: direction === "rtl" ? "right" : "left" }}
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
        <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8, minWidth: 120 }}>
          <h3>{t("dashboard.statsDraft")}</h3>
          <p style={{ fontSize: 24 }}>{stats.draft}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8, minWidth: 120 }}>
          <h3>{t("dashboard.statsScheduled")}</h3>
          <p style={{ fontSize: 24 }}>{stats.scheduled}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8, minWidth: 120 }}>
          <h3>{t("dashboard.statsPublished")}</h3>
          <p style={{ fontSize: 24 }}>{stats.published}</p>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>{t("dashboard.recentPosts")}</h2>
        {recent_posts.length === 0 ? (
          <p>{t("dashboard.noPosts")}</p>
        ) : (
          <ul>
            {recent_posts.map((post) => (
              <li key={post.id}>
                <strong>{getStatusLabel(t, post.status)}</strong> — {post.content.slice(0, 80)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>{t("dashboard.socialAccounts")}</h2>
        {social_accounts.length === 0 ? (
          <p>{t("dashboard.noAccounts")}</p>
        ) : (
          <ul>
            {social_accounts.map((acc) => (
              <li key={acc.id}>
                {acc.platform} — {acc.account_name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
