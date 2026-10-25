# دليل ربط ونشر منصة أكاديمية عبير جاد على سيرفر VPS باستخدام Coolify

تهانينا! تم إعداد مستودع الأكاديمية بالكامل ليعمل بسلاسة تامة مع **Coolify** عبر حاويات Docker الخفيفة عالية الكفاءة (Next.js Standalone).

---

## 🚀 خطوات الربط والنشر في لوحة تحكم Coolify (خطوة بخطوة)

### 1. إضافة المشروع (Add Application)
1. في لوحة تحكم Coolify، اذهب إلى مشروعك ثم اضغط **+ New** ثم اختر **Application**.
2. اختر **Public Repository** أو **GitHub App** (إذا كان حسابك مربوطاً).
3. ضع رابط المستودع:
   ```text
   https://github.com/Hazemabouseafa/abeer-gad-academy
   ```
4. اختر الفرع: `main`.
5. سيكتشف Coolify ملف `Dockerfile` تلقائياً ويعتمده كـ **Build Pack: Dockerfile**.

---

### 2. إعدادات الشبكة والمنافذ (Ports & Domains)
1. في حقل **Domains**: ضع الدومين الخاص بك (مثال: `https://academy.yourdomain.com`).
2. تأكد من ضبط **Ports Exposes** على:
   ```text
   3000
   ```
   (سيرفر التطبيق مصمم ليعمل داخلياً على المنفذ `3000` ويقوم Coolify/Traefik بإدارته وتوليد شهادة SSL تلقائياً).

---

### 3. حفظ البيانات والملفات المرفوعة (Persistent Storage) ⚠️ هام جداً
لكي تظل الدورات، والمواعيد، والإعدادات، والفيديوهات والملفات المرفوعة محفوظة للأبد حتى عند إعادة بناء السيرفر (Redeploy):
1. انتقل إلى تبويب **Storages** في إعدادات التطبيق داخل Coolify.
2. اضغط **Add Storage** وأضف الحجمين التاليين:

| Name | Destination Path (مسار الحاوية) | الوصف |
|---|---|---|
| `academy-data` | `/app/data` | يحفظ متجر الدورات والإعدادات والحجوزات |
| `academy-uploads` | `/app/public/uploads` | يحفظ الفيديوهات وملفات الـ PDF المرفوعة من الإدارة |

---

### 4. المتغيرات البيئية (Environment Variables)
في تبويب **Environment Variables**، يمكنك نسخ القيم التالية وتعديلها حسب نطاقك:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_DEFAULT_LOCALE=ar

# مفاتيح جلسة الإدارة (غيّرها لقيم سرية عشوائية)
ADMIN_SECRET_KEY=abeer_gad_academy_admin_secret_key_production_2026
SESSION_SECRET=abeer_gad_academy_session_secret_key_production_2026
NEXT_PUBLIC_ADMIN_EMAIL=admin@abeergadacademy.com

# إعدادات PayPal (اختياري - في حال تفعيل بوابات الدفع لاحقاً)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_MODE=live
```

---

### 5. بدء النشر (Deploy)
- اضغط زر **Deploy** في أعلى الصفحة.
- سيقوم Coolify ببناء الحاوية عبر `Dockerfile` متعدد المراحل وتفعيل شهادة الحماية SSL التلقائية عبر Let's Encrypt مجاناً!
- ستصبح منصتك جاهزة وحية للزوار في خلال دقيقتين.
