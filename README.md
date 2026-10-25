# ABEER GAD Academy | أكاديمية عبير جاد لعلوم القرآن واللغة العربية

An advanced, full-stack educational platform for Classical Arabic, Quran Recitation (Tajweed), and Memorization (Hifz) with verified continuous Sanad under the direct scholarship of **Ustadha Abeer Gad**.

---

## 🌟 Key Highlights & Features

- **Multilingual Architecture**: 5 fully supported international locales (`ar`, `en`, `fr`, `de`, `zh`) powered by `next-intl` with seamless RTL/LTR layout transitions.
- **Strict Light Mode Palette**: Warm cream (`#FDFBF7`, `#FAF7F0`), crisp white cards (`#FFFFFF`), serene teal (`#0F766E`), and refined gold (`#B45309`).
- **Comprehensive Services & Pathway Cards**:
  - Foundational Arabic to Fluency & Syntax (Nahw & Sarf).
  - Quran Reading & Noorani Qaida.
  - Quran Memorization & Mutashabihat Acceleration.
  - Tajweed Rules & Scholarly Sanad.
  - Specialized Classical Arabic (Jurisprudence & Hermeneutics).
  - Dedicated 1-on-1 VIP Private Sessions.
- **Centralized Admin CMS**:
  - 6 Non-duplicated operational modules (`Overview`, `Frontend CMS`, `Courses & Curriculum`, `1-on-1 Slots`, `Digital Library`, `Financials & Students`).
  - Zero modal popups — 100% inline editing with smooth DOM scrolling.
  - Dynamic live publishing reflecting directly on the homepage.
  - **Neural Multi-Language Auto-Translation**: Translates Arabic content into English and other languages automatically on save or via one-click smart buttons (`/api/admin/translate`).
- **Floating WhatsApp Widget**: Persistent, dynamic WhatsApp action button with live pulsating indicator and direct chat.
- **Payments & Student Enrollment**: Integrated PayPal Checkout with mandatory international phone validation and transaction recording.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Type-Safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **ORM & Database**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Payments**: PayPal REST API SDK

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm, yarn, or pnpm
- Git

### 2. Installation
```bash
git clone https://github.com/hazemabouseafa/abeer-gad-academy.git
cd abeer-gad-academy
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Database Setup
```bash
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5001](http://localhost:5001) in your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 📜 License
All rights reserved © 2026 Abeer Gad Academy.
