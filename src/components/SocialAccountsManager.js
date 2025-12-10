// src/components/SocialAccountsManager.js
import React, { useEffect, useState } from "react";
import { fetchSocialAccounts, createSocialAccount, deleteSocialAccount, updateSocialAccount } from "../api/index";

function SocialAccountsManager({ t, direction }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // حقول نموذج الإضافة
  const [platform, setPlatform] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountUrl, setAccountUrl] = useState("");
  const [success, setSuccess] = useState("");
  const inputStyle = { width: "100%", padding: 6, boxSizing: "border-box" };
  const [editingId, setEditingId] = useState(null);


  const accessToken = localStorage.getItem("accessToken");

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSocialAccounts(accessToken);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setAccounts(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess("");

    try {
      const payload = {
        platform,
        account_name: accountName,
        account_url: accountUrl || null,
      };

      let response;
      if (editingId) {
        // تعديل
        response = await updateSocialAccount(accessToken, editingId, payload);
      } else {
        // إضافة جديدة
        response = await createSocialAccount(accessToken, payload);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPlatform("");
      setAccountName("");
      setAccountUrl("");
      setEditingId(null);
      setSuccess(
        editingId ? t("social.updateSuccess") : t("social.addSuccess")
      );
      await loadAccounts();
    } catch (err) {
      setError(err.message);
    }
  };


  const handleDelete = async (id) => {
    setError(null);
    setSuccess("");
    try {
      const response = await deleteSocialAccount(accessToken, id);
      if (!response.ok && response.status !== 204) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSuccess(t("social.deleteSuccess"));
      await loadAccounts();
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <div
      style={{
        marginTop: 24,
        direction,
        textAlign: direction === "rtl" ? "right" : "left",
      }}
    >
      <h2>{t("dashboard.socialAccounts")}</h2>

      {loading && <p>{t("login.loading")}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        type="button"
        onClick={loadAccounts}
        style={{ marginBottom: 8 }}
      >
        {t("social.refresh")}
      </button>

      {accounts.length === 0 ? (
        <p>{t("dashboard.noAccounts")}</p>
      ) : (
        <ul>
          {accounts.map((acc) => (
            <li key={acc.id}>
              {acc.platform} — {acc.account_name}
              {acc.account_url ? (
                <>
                  {" — "}
                  <a href={acc.account_url} target="_blank" rel="noreferrer">
                    {t("social.openAccount")}
                  </a>
                </>
              ) : null}
              {"    "}
              <button
                type="button"
                onClick={() => handleDelete(acc.id)}
                style={{ marginInlineStart: 8 }}
              >
                {t("social.delete")}
              </button>
              {"    "}
              <button
                type="button"
                onClick={() => {
                  setPlatform(acc.platform);
                  setAccountName(acc.account_name);
                  setAccountUrl(acc.account_url || "");
                  setEditingId(acc.id);
                  setSuccess("");
                  setError(null);
                }}
                style={{ marginInlineStart: 8 }}
              >
                {t("social.edit")}
              </button>

              {acc.is_active === false ? ` — ${t("social.inactive")}` : ""}
            </li>
          ))}

        </ul>
      )}

      <h3 style={{ marginTop: 16 }}>{t("social.addAccountTitle")}</h3>


      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>

        <div style={{ marginBottom: 8 }}>
          <label>{t("social.platform")}</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={inputStyle}
            required
          >
            <option value="">{t("social.platformPlaceholder")}</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter / X</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="other">{t("social.platformOther")}</option>
          </select>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>{t("social.accountName")}</label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t("social.accountUrl")}</label>
          <input
            type="url"
            value={accountUrl}
            onChange={(e) => setAccountUrl(e.target.value)}
            style={inputStyle}
            placeholder="https://..."
          />
        </div>

        <button type="submit" style={{ padding: "6px 12px" }}>
          {t("social.addButton")}
        </button>
      </form>
    </div>
  );
}

export default SocialAccountsManager;
