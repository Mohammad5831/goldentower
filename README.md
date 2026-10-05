# Golden Tower Backend

Backend پروژه فروشگاه آنلاین **Golden Tower** با معماری REST API و با هدف مدیریت کاربران، محصولات، سبد خرید، آدرس‌ها، سفارش‌ها، پرداخت و محتوای فروشگاه توسعه داده شده است.

---

## 📌 معرفی

این Backend هسته اصلی فروشگاه Golden Tower است و ارتباط بین Frontend، پایگاه داده و سرویس پرداخت را مدیریت می‌کند.

ساختار سیستم به گونه‌ای طراحی شده که منطق اصلی در Backend کنترل شود و اطلاعات حساس یا قابل اعتماد نبودنی از سمت Frontend مبنای تصمیم‌گیری قرار نگیرد.

### تکنولوژی‌های اصلی

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT
- express-validator
- Multer
- Axios
- ZarinPal

---

## 🏗️ معماری پروژه

ساختار Backend بر پایه جداسازی مسئولیت‌ها طراحی شده است:

```text
Backend
│
├── config/        تنظیمات Database
├── controller/    مدیریت Request و Response
├── middleware/    Authentication، Authorization، Upload و Validation
├── model/         مدل‌ها و روابط Database
├── router/        تعریف API Endpointها
├── service/       Business Logic و عملیات Database
├── validator/     اعتبارسنجی ورودی‌ها
├── utilitie/      توابع عمومی
├── storage/       فایل‌های آپلود شده
└── index.js       نقطه شروع برنامه
```

جریان معمول هر درخواست به شکل زیر است:

```text
Frontend
   ↓
Router
   ↓
Middleware / Authentication
   ↓
Validator
   ↓
Controller
   ↓
Service
   ↓
Model / Database
   ↓
Response
```

---

# 🔐 احراز هویت

سیستم احراز هویت بدون Password طراحی شده و از **شماره موبایل + OTP** استفاده می‌کند.

### روند ورود / ثبت‌نام

```text
شماره موبایل
      ↓
بررسی User
      ↓
ایجاد یا پیدا کردن User
      ↓
ارسال OTP
      ↓
تأیید OTP
      ↓
ایجاد JWT
      ↓
ورود به سیستم
```

OTP دارای اعتبار محدود است و پس از استفاده یا منقضی شدن حذف می‌شود.

JWT شامل اطلاعات مورد نیاز برای شناسایی کاربر و سطح دسترسی او است.

---

# 🆔 معماری UUID

یکی از اصول اصلی Backend این پروژه استفاده از **UUID برای ارتباط Frontend و Backend** است.

شناسه‌های عددی داخلی Database مانند:

```text
user_id
product_id
order_id
payment_id
address_id
cart_id
```

فقط در Backend و Database استفاده می‌شوند.

Frontend با شناسه‌های عمومی مانند موارد زیر کار می‌کند:

```text
user_uuid
product_uuid
category_uuid
brand_uuid
address_uuid
order_uuid
payment_uuid
article_uuid
```

به عنوان مثال:

```text
Frontend
product_uuid
    ↓
Backend
product_uuid → product_id
    ↓
Database
```

این کار باعث می‌شود ساختار داخلی Database مستقیماً در اختیار Client قرار نگیرد.

---

# 👤 کاربران

User شامل اطلاعات اصلی حساب کاربری است، از جمله:

- نام و نام خانوادگی
- شماره موبایل
- ایمیل
- تصویر پروفایل
- وضعیت حساب
- وضعیت Admin

وضعیت کاربر می‌تواند شامل موارد زیر باشد:

```text
active
inactive
blocked
```

کاربر Block شده حتی با OTP صحیح اجازه ورود ندارد.

---

# 🛍️ محصولات

محصولات شامل اطلاعاتی مانند:

- نام
- مدل
- قیمت فعلی
- قیمت اصلی
- تخفیف
- توضیحات
- موجودی
- پیشنهاد ویژه
- تصویر
- سایز
- دسته‌بندی
- برند

هستند.

قیمت و موجودی معتبر همیشه از Backend و Database خوانده می‌شود و Frontend منبع قابل اعتماد برای این اطلاعات نیست.

---

# 🏷️ دسته‌بندی و برند

دسته‌بندی و برند به صورت جدول‌های مستقل در Database نگهداری می‌شوند.

```text
Category 1 ─── N Product

Brand    1 ─── N Product
```

Frontend برای کار با آن‌ها از UUID استفاده می‌کند.

---

# 🛒 سبد خرید

سیستم سبد خرید برای دو نوع کاربر طراحی شده است.

### Guest

سبد خرید کاربر مهمان در `localStorage` مرورگر نگهداری می‌شود.

### User

پس از ورود کاربر، سبد خرید در Database نگهداری می‌شود.

```text
Guest Cart
   ↓ Login
LocalStorage Cart
   ↓ Sync
User Cart in Database
```

هنگام Sync شدن سبد خرید، Backend محصولات، موجودی و قیمت را دوباره بررسی می‌کند.

---

# 📍 آدرس‌ها

کاربر می‌تواند چند آدرس داشته باشد و یکی از آن‌ها را به عنوان آدرس پیش‌فرض انتخاب کند.

اطلاعات Address شامل مواردی مانند:

- عنوان آدرس
- نام گیرنده
- شماره گیرنده
- استان
- شهر
- آدرس
- کد پستی
- پلاک
- واحد
- وضعیت پیش‌فرض

است.

تمام عملیات از طریق `address_uuid` انجام می‌شود و Backend مالکیت Address را نسبت به کاربر بررسی می‌کند.

---

# 📦 سفارش

Order نتیجه نهایی فرآیند خرید است.

سفارش شامل اطلاعاتی مانند:

- کاربر
- آدرس
- مبلغ
- وضعیت سفارش
- وضعیت پرداخت
- اطلاعات گیرنده
- اطلاعات سفارش

است.

### Snapshot آدرس

هنگام ایجاد سفارش، اطلاعات آدرس انتخاب‌شده داخل Order نیز ذخیره می‌شود.

این موضوع مهم است چون اگر کاربر بعداً آدرس خود را تغییر دهد، سفارش‌های قبلی نباید تغییر کنند.

```text
Address فعلی
      ↓
   Create Order
      ↓
Address Snapshot
      ↓
اطلاعات سفارش ثابت می‌ماند
```

---

# 📦 اقلام سفارش

هر Order شامل یک یا چند OrderItem است.

هر OrderItem اطلاعات زیر را نگهداری می‌کند:

- محصول
- تعداد
- قیمت واحد در زمان خرید
- قیمت کل

قیمت در زمان ثبت سفارش Snapshot می‌شود تا تغییر قیمت محصول در آینده روی سفارش‌های قبلی تأثیر نگذارد.

---

# 💳 پرداخت

سیستم پرداخت با **ZarinPal** یکپارچه شده است.

جریان کلی پرداخت:

```text
انتخاب Address
      ↓
Payment Request
      ↓
بررسی Cart
      ↓
محاسبه مبلغ در Backend
      ↓
ایجاد Order
      ↓
ایجاد OrderItem
      ↓
ایجاد Payment
      ↓
درخواست پرداخت از ZarinPal
      ↓
دریافت Authority
      ↓
انتقال کاربر به درگاه
      ↓
Callback
      ↓
Payment Verify
      ↓
تأیید توسط ZarinPal
      ↓
کاهش موجودی
      ↓
Payment = paid
      ↓
Order = processing
      ↓
خالی شدن Cart
```

### شروع پرداخت

```http
POST /api/payment/request
```

Body:

```json
{
  "address_uuid": "ADDRESS-UUID"
}
```

### تأیید پرداخت

```http
POST /api/payment/verify
```

Body:

```json
{
  "order_uuid": "ORDER-UUID",
  "Authority": "AUTHORITY",
  "Status": "OK"
}
```

مبلغ پرداخت توسط Backend محاسبه می‌شود و Client نمی‌تواند مبلغ نهایی را تعیین کند.

---

# 📝 مقالات

سیستم Articles برای مدیریت محتوای فروشگاه استفاده می‌شود.

مقالات دارای وضعیت‌های زیر هستند:

```text
draft
published
```

محتوای مقاله به صورت JSON ذخیره می‌شود و در حال حاضر بخش‌های زیر پشتیبانی می‌شوند:

```text
paragraph
heading
```

### Public API

```http
GET /api/articles
GET /api/articles/:article_uuid
```

### Admin API

```http
GET    /api/articles/admin/all
GET    /api/articles/admin/:article_uuid
POST   /api/articles/admin
PUT    /api/articles/admin/:article_uuid
DELETE /api/articles/admin/:article_uuid
PATCH  /api/articles/admin/:article_uuid/status
```

---

# ⚙️ تنظیمات فروشگاه

Settings اطلاعات کلی فروشگاه را مدیریت می‌کند، از جمله:

- نام سایت
- عنوان سایت
- توضیحات
- اطلاعات تماس
- شبکه‌های اجتماعی
- وضعیت فروشگاه
- تنظیمات ارسال
- تنظیمات پرداخت
- تنظیمات SEO
- زبان
- Banner صفحه اصلی

این بخش فقط توسط Admin قابل مدیریت است.

---

# 🖼️ آپلود تصاویر

آپلود تصاویر با Multer انجام می‌شود.

فرمت‌های مجاز:

```text
JPG
JPEG
PNG
WEBP
```

حداکثر حجم فایل:

```text
5 MB
```

نام فایل‌ها با UUID تصادفی تولید می‌شود تا نام فایل‌ها قابل حدس و تکراری نباشند.

تصاویر محصولات در مسیر زیر ذخیره می‌شوند:

```text
storage/products
```

و از مسیر زیر در دسترس هستند:

```text
/api/image
```

---

# 🛡️ امنیت و اعتبارسنجی

در Backend موارد زیر کنترل می‌شوند:

- JWT Authentication
- Admin Authorization
- جداسازی Guest و User
- Validation ورودی‌ها
- اعتبارسنجی UUID
- محدودیت حجم فایل
- محدودیت فرمت فایل
- بررسی مالکیت Address
- بررسی مالکیت Order
- بررسی موجودی محصول
- عدم اعتماد به قیمت Frontend
- استفاده از Transaction در عملیات حساس

---

# 🔄 Transaction

عملیات حساس مانند ایجاد سفارش و پرداخت به صورت Transaction مدیریت می‌شوند.

برای مثال:

```text
Create Order
   +
Create OrderItems
   +
Create Payment
```

اگر یکی از عملیات شکست بخورد، تغییرات Transaction Rollback می‌شوند.

---

# 📊 روابط اصلی Database

```text
User
 ├── Cart
 ├── Address
 └── Order

Category
 └── Product

Brand
 └── Product

Cart
 └── CartItem
      └── Product

Order
 ├── OrderItem
 │    └── Product
 └── Payment

Product
 ├── GeneralSpec
 └── DetailedSpec
```

---

# 🚀 نصب و اجرا

## پیش‌نیازها

- Node.js 18+
- MySQL 8+
- npm

## نصب

```bash
npm install
```

## تنظیم Environment

فایل `.env` باید شامل تنظیمات مورد نیاز پروژه باشد، از جمله:

```env
PORT=3000

DB_NAME=...
DB_USER=...
DB_PASS=...
DB_HOST=...
DB_PORT=3306

JWT_SECRET=...

MERCHANT_ID=...
CALLBACK_URL=...
```

مقادیر واقعی و Secretها نباید در GitHub قرار بگیرند.

## اجرا

```bash
npm start
```

در صورت وجود Script توسعه:

```bash
npm run dev
```

در زمان Startup ابتدا اتصال Database بررسی می‌شود، سپس Modelها Synchronize و بعد Server اجرا می‌شود.

---

# 🌐 API Base URL

در محیط Local معمولاً:

```text
http://localhost:3000/api
```

ساختار کلی Endpointها:

```text
/api/auth
/api/products
/api/categories
/api/brands
/api/carts
/api/addresses
/api/payment
/api/articles
/api/settings
/api/admin
```

---

# 🔑 Authentication Header

Endpointهای محافظت‌شده باید Token را به شکل زیر دریافت کنند:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 🧪 سناریوی تست خرید

برای تست کامل سیستم، ترتیب زیر پیشنهاد می‌شود:

```text
1. Login / OTP
2. دریافت JWT
3. دریافت Product
4. افزودن Product به Cart
5. دریافت Cart
6. ایجاد Address
7. انتخاب Address
8. Payment Request
9. انتقال به ZarinPal
10. Callback
11. Payment Verify
12. بررسی Order
13. بررسی OrderItem
14. بررسی Payment
15. بررسی Stock
16. بررسی خالی شدن Cart
```

---

# 👨‍💼 بخش مدیریت

Endpointهای Admin با JWT و `requireAdmin` محافظت می‌شوند.

Admin می‌تواند بخش‌هایی مانند موارد زیر را مدیریت کند:

- محصولات
- دسته‌بندی‌ها
- برندها
- کاربران
- مقالات
- تنظیمات فروشگاه
- سفارش‌ها

کاربر عادی اجازه دسترسی به Endpointهای Admin را ندارد.

---

# ⚠️ نکات مهم توسعه

### 1. ID داخلی را در API استفاده نکنید

به جای:

```text
/products/15
```

از UUID استفاده شود.

### 2. به قیمت Frontend اعتماد نکنید

قیمت نهایی باید در Backend محاسبه شود.

### 3. مالکیت Resourceها بررسی شود

مثلاً User نباید بتواند با داشتن `address_uuid` متعلق به شخص دیگر، آن Address را مشاهده یا ویرایش کند.

### 4. Controller سبک باقی بماند

Queryهای Database و Business Logic اصلی باید در Service قرار داشته باشند.

### 5. تغییرات چندجدولی حساس Transaction داشته باشند

---

# 🔮 قابلیت‌های قابل توسعه در آینده

ساختار فعلی امکان توسعه قابلیت‌هایی مانند موارد زیر را دارد:

- سیستم رزرو موجودی
- Coupon و Discount
- سیستم تخفیف پیشرفته
- Refund خودکار
- سیستم Shipping پیشرفته
- Notification
- گزارش‌های مدیریتی
- سیستم Wishlist
- سیستم Review و Rating
- Cache
- Queue و Background Jobs

این قابلیت‌ها در صورت نیاز می‌توانند بدون تغییر اساسی در معماری فعلی اضافه شوند.

---

# 📄 جمع‌بندی

Backend پروژه Golden Tower یک REST API ماژولار مبتنی بر Node.js و Express.js است که با Sequelize و MySQL کار می‌کند.

سیستم دارای احراز هویت Phone + OTP، مدیریت کاربران، محصولات، برندها، دسته‌بندی‌ها، سبد خرید، آدرس‌ها، سفارش‌ها، پرداخت آنلاین، مقالات و تنظیمات فروشگاه است.

معماری پروژه بر پایه جداسازی مسئولیت‌ها، استفاده از UUID در ارتباط Client و Server، اعتبارسنجی ورودی‌ها، کنترل دسترسی و مدیریت Transaction طراحی شده است.

هدف اصلی این ساختار، حفظ امنیت، قابل نگهداری بودن کد و فراهم کردن امکان توسعه آینده بدون پیچیده کردن غیرضروری Backend است.
