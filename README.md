# afaq-frontend – محور سوشال (React Dashboard)

هذا المستودع يحتوي على واجهة **محور سوشال** المبنية بـ React، مع دعم لغتين (العربية/الإنجليزية)، وتكامل مع API الباك‑إند في مستودع `SM_APP`.

## المزايا الحالية

- شاشة تسجيل دخول مرتبطة بمصادقة JWT في الباك‑إند.
- لوحة داشبورد تعرض:
  - إحصاءات المنشورات (مسودات، مجدولة، منشورة).
  - آخر المنشورات مع حالة كل منشور.
  - حسابات السوشال المرتبطة.
- دعم لغتين (العربية/الإنجليزية) مع تبديل فوري.
- تخزين التوكنات (`accessToken`, `refreshToken`) في `localStorage`.
- منطق ذكي لاختيار الباك‑إند:
  - عند العمل المحلي: الاتصال بـ `http://127.0.0.1:8000`.
  - من GitHub Pages: الاتصال بـ `https://sm-app.up.railway.app` (أو رابط الإنتاج).

## هيكلة المجلد `src`

src/
api/
index.js # login, fetchDashboardApi, ودوال API أخرى
config/
index.js # API_BASE_URL + منطق localhost vs Railway
i18n/
index.js # createTranslator
locales/
ar.json # نصوص الواجهة بالعربية
en.json # نصوص الواجهة بالإنجليزية
components/
LoginForm.js # شاشة تسجيل الدخول
Dashboard.js # لوحة التحكم (إحصاءات + منشورات + حسابات)
App.js # تحكّم بالحالة العامة (تسجيل الدخول، اللغة، البيانات)
App.css


هذه الهيكلة تجعل إعادة الاستخدام أو الانتقال إلى Next.js لاحقًا أسهل بكثير.

## إعداد وتشغيل الواجهة محليًا

cd D:\Projects\python\afaq-frontend

npm install
npm start


سيتم فتح التطبيق على:

- <http://localhost:3000/afaq-frontend>

### الربط مع الباك‑إند

في `src/config/index.js`:

const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
? "http://127.0.0.1:8000"
: "https://sm-app.up.railway.app"; // عدّل هذا الرابط عند تغيير منصة الباك‑إند


- أثناء التطوير محليًا: شغّل Django على `127.0.0.1:8000` ثم `npm start`.
- من GitHub Pages: الطلبات تذهب تلقائيًا إلى باك‑إند الإنتاج (Railway حاليًا).

## النشر على GitHub Pages

استخدم حزمة `gh-pages` لنشر الإصدار الإنتاجي:

### سكربتات `package.json`

"homepage": "https://Ihsan76.github.io/afaq-frontend",
"scripts": {
"start": "react-scripts start",
"build": "react-scripts build",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
}

### أوامر النشر

npm run deploy


بعدها تصبح الواجهة متاحة على:

- <https://Ihsan76.github.io/afaq-frontend>

مع ربط كامل بالباك‑إند على Railway.

## الترجمة (i18n)

- ملفات الترجمة:

  - `src/i18n/locales/ar.json`
  - `src/i18n/locales/en.json`

- تستخدم دالة `createTranslator` من `src/i18n/index.js` لتوفير:
  - `t(key)` لترجمة النصوص.
  - `direction` (rtl/ltr) لضبط الإتجاه.
- حالات المنشور (`draft`, `scheduled`, `published`) تُترجم عبر مفاتيح:

  - `post.status.draft`
  - `post.status.scheduled`
  - `post.status.published`

ما يجعل البيانات القادمة من الباك‑إند تظهر بالعربية أو الإنجليزية حسب اختيار المستخدم.

## الخطوات التالية المحتملة

- إضافة شاشة إدارة حسابات السوشال (عرض/إضافة/تعديل/حذف) مبنية على نفس API الحالي.
- إضافة CRUD كامل للمنشورات (إنشاء، تعديل، حذف، جدولة).
- إمكانية الانتقال مستقبلاً إلى Next.js مع إعادة استخدام `components`, `api`, `i18n` كما هي تقريبًا.
