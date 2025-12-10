import React, { useEffect, useState } from 'react';
import './App.css';
import { createTranslator } from './i18n';

const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
  ? "http://127.0.0.1:8000"              // باك‑إند المحلي + قاعدة البيانات المحلية
  : "https://sm-app.up.railway.app";     // باك‑إند Railway

function App() {
  const [locale, setLocale] = useState('ar'); // ar أو en
  const { t, direction, langName } = createTranslator(locale);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState('ihsan');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('accessToken')
  );

  // دالة تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`${t('login.errorPrefix')} ${response.status}`);
      }

      const json = await response.json();

      localStorage.setItem('accessToken', json.access);
      localStorage.setItem('refreshToken', json.refresh);

      setIsLoggedIn(true);
      setPassword('');
      fetchDashboard(json.access);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // دالة تحميل الداشبورد
  const fetchDashboard = async (token) => {
  setLoading(true);
  setError(null);

  const accessToken = token || localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_BASE_URL}/api/mahwar/dashboard/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    console.log('Response status:', response.status);

    // لو التوكن غير صالح أو منتهي → نرجع لصفحة تسجيل الدخول
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setData(null);
      setLoading(false);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    console.log('JSON data:', json);
    setData(json);
    setLoading(false);
  } catch (err) {
    console.error('fetch error:', err);
    setError(err.message);
    setLoading(false);
  }
};


  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setData(null);
    setError(null);
  };

  // عند فتح الصفحة: استخدام التوكن إن وجد
  useEffect(() => {
    const existingToken = localStorage.getItem('accessToken');
    if (existingToken) {
      setIsLoggedIn(true);
      fetchDashboard(existingToken);
    }
  }, []);

  // شاشة التحميل
  if (loading) {
    return (
      <div className="App" style={{ padding: 20, direction }}>
        {t('login.loading')}
      </div>
    );
  }

  // شاشة تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div
        className="App"
        style={{ padding: 20, direction, textAlign: direction === 'rtl' ? 'right' : 'left' }}
      >
        {/* شريط أعلى لتغيير اللغة */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: direction === 'rtl' ? 'flex-start' : 'flex-end' }}>
          <button
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            style={{ padding: '4px 8px', fontSize: 12 }}
          >
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>

        <h1>{t('login.title')}</h1>

        {error && (
          <div style={{ color: 'red', marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ maxWidth: 320 }}>
          <div style={{ marginBottom: 12 }}>
            <label>{t('login.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <button type="submit" style={{ padding: '8px 16px' }}>
            {t('login.submit')}
          </button>
        </form>
      </div>
    );
  }

  // بعد تسجيل الدخول: معالجة خطأ/غياب بيانات
  if (error) {
    return (
      <div
        className="App"
        style={{ padding: 20, color: 'red', direction, textAlign: direction === 'rtl' ? 'right' : 'left' }}
      >
        {t('login.errorPrefix')} {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="App"
        style={{ padding: 20, direction, textAlign: direction === 'rtl' ? 'right' : 'left' }}
      >
        {t('dashboard.noData')}
      </div>
    );
  }

  const { stats, recent_posts, social_accounts } = data;

  // واجهة الداشبورد
  return (
    <div
      className="App"
      style={{ padding: 20, direction, textAlign: direction === 'rtl' ? 'right' : 'left' }}
    >
      {/* شريط أعلى: لغة + خروج */}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: direction === 'rtl' ? 'space-between' : 'space-between',
        }}
      >
        <button
          onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
          style={{ padding: '4px 8px', fontSize: 12 }}
        >
          {locale === 'ar' ? 'EN' : 'AR'}
        </button>

        <button
          onClick={handleLogout}
          style={{ padding: '4px 8px', fontSize: 12 }}
        >
          {t('dashboard.logout')}
        </button>
      </div>

      <h1>{t('dashboard.title')}</h1>

      <section style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8, minWidth: 120 }}>
          <h3>{t('dashboard.statsDraft')}</h3>
          <p style={{ fontSize: 24 }}>{stats.draft}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8, minWidth: 120 }}>
          <h3>{t('dashboard.statsScheduled')}</h3>
          <p style={{ fontSize: 24 }}>{stats.scheduled}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8, minWidth: 120 }}>
          <h3>{t('dashboard.statsPublished')}</h3>
          <p style={{ fontSize: 24 }}>{stats.published}</p>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>{t('dashboard.recentPosts')}</h2>
        {recent_posts.length === 0 ? (
          <p>{t('dashboard.noPosts')}</p>
        ) : (
          <ul>
            {recent_posts.map((post) => (
              <li key={post.id}>
                <strong>{post.status}</strong> — {post.content.slice(0, 80)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>{t('dashboard.socialAccounts')}</h2>
        {social_accounts.length === 0 ? (
          <p>{t('dashboard.noAccounts')}</p>
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

export default App;
