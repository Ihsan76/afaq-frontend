import React, { useState, useEffect } from "react";


// function PostsManager({ t, direction, posts = [], onPostCreated }) {
// ...
function PostsManager({ t, direction }) {
    const [posts, setPosts] = useState([]);
    // باقي الـ state كما هي...

    const [content, setContent] = useState("");
    const [platforms, setPlatforms] = useState({
        facebook: false,
        twitter: false,
        instagram: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [status, setStatus] = useState("draft");
    const [scheduledAt, setScheduledAt] = useState("");

    const accessToken = localStorage.getItem("accessToken");

    const handleCheckbox = (name) => {
        setPlatforms((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const payload = {
                content,
                platforms,
                status,
                scheduled_at: scheduledAt || null,
            };


            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000"}/api/mahwar/posts/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: accessToken ? `Bearer ${accessToken}` : "",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setContent("");
            setPlatforms({ facebook: false, twitter: false, instagram: false });
            setSuccess(t("post.addSuccess"));
            await loadPosts();   // إعادة تحميل القائمة بعد الإضافة

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadPosts = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000"}/api/mahwar/posts/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: accessToken ? `Bearer ${accessToken}` : "",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            setPosts(json);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div
            style={{
                marginTop: 24,
                direction,
                textAlign: direction === "rtl" ? "right" : "left",
            }}
        >
            <h2>{t("post.managerTitle")}</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <h3>{t("post.latestTitle")}</h3>
            {(!posts || posts.length === 0) ? (

                <p>{t("dashboard.noPosts")}</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            {getPreview(post.content)} — {t(`post.status.${post.status}`)}
                        </li>
                    ))}
                </ul>
            )}

            <h3 style={{ marginTop: 16 }}>{t("post.addTitle")}</h3>
            <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                <div style={{ marginBottom: 8 }}>
                    <label>{t("post.content")}</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: "100%", padding: 6, minHeight: 80 }}
                    />
                </div>

                <div style={{ marginBottom: 8 }}>
                    <span>{t("post.platforms")}</span>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={platforms.facebook}
                                onChange={() => handleCheckbox("facebook")}
                            />{" "}
                            Facebook
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={platforms.twitter}
                                onChange={() => handleCheckbox("twitter")}
                            />{" "}
                            Twitter / X
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={platforms.instagram}
                                onChange={() => handleCheckbox("instagram")}
                            />{" "}
                            Instagram
                        </label>
                    </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>{t("post.statusLabel")}</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ width: "100%", padding: 6, boxSizing: "border-box" }}
                    >
                        <option value="draft">{t("post.status.draft")}</option>
                        <option value="scheduled">{t("post.status.scheduled")}</option>
                        <option value="published">{t("post.status.published")}</option>
                    </select>
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>{t("post.scheduledAt")}</label>
                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        style={{ width: "100%", padding: 6, boxSizing: "border-box" }}
                    />
                </div>

                <button type="submit" disabled={loading} style={{ padding: "6px 12px" }}>
                    {loading ? t("login.loading") : t("post.addButton")}
                </button>
            </form>
        </div>
    );
}

function getPreview(text, max = 40) {
    if (!text) return "";
    return text.length <= max ? text : text.slice(0, max) + "...";
}

export default PostsManager;
