# Zaza Financial Education Platform

<div align="center">
  <h2>🧒 Financial Literacy Education for Children Ages 5-16</h2>
  <p>Empowering young minds with smart financial skills through engaging, age-appropriate learning experiences.</p>
</div>

---

## 🎯 About Zaza Academy

Zaza Academy is a comprehensive financial education platform designed to teach children and teens essential money management skills in a fun, interactive way. Our mission is to build financial confidence from an early age through playful learning that delivers real-world skills.

### Why Financial Education Matters

- **70%** of adults wish they'd learned about money earlier
- Children who receive financial education are **3x more likely to save** as adults
- **By age 7**, financial habits are established—starting early is crucial

---

## ✨ Key Features

| Feature                        | Description                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| 🔐 **Secure Authentication**   | Login & multi-step signup with HttpOnly cookie-based sessions      |
| 📊 **Dashboard**               | Personalized stats, children management, recent activity           |
| 💳 **Subscription Management** | 3 tiers (Solo, Family, Family Plus), billing history               |
| 🌍 **Multi-Language**          | Full English & French support (next-intl)                          |
| 📱 **Responsive**              | Mobile-first design, tablet & desktop optimized                    |
| 🎨 **Modern UI**               | Framer Motion animations, gradient accents, interactive components |
| 🛡️ **Security Hardened**       | CSP, HSTS, XSS protection, Middleware auth guard                   |
| 🔍 **SEO Optimized**           | Dynamic OG images, sitemap, robots.txt, structured metadata        |

---

## 🛠️ Tech Stack

| Layer                    | Technology                        |
| ------------------------ | --------------------------------- |
| **Framework**            | Next.js 16 (App Router, React 19) |
| **Language**             | TypeScript                        |
| **State Management**     | Redux Toolkit + RTK Query         |
| **Styling**              | Tailwind CSS 4                    |
| **Animations**           | Framer Motion                     |
| **Icons**                | Lucide React                      |
| **Form Validation**      | Zod                               |
| **Internationalization** | next-intl                         |
| **Testing**              | Playwright (E2E)                  |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd zaza-financial-education

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Environment Variables

Create `.env.local` at project root:

```env
# Backend API URL (Django)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

> **Note**: The frontend works without the backend running. API calls will fail gracefully, and a demo fallback is active in development mode for the signup flow.

---

## 📁 Project Structure

```
zaza-financial-education/
├── app/                            # Next.js App Router
│   ├── api/                       # 🔒 Server-side API Proxy (BFF)
│   │   ├── auth/login/route.ts    #   Login proxy (sets HttpOnly cookies)
│   │   ├── auth/logout/route.ts   #   Logout proxy (clears cookies)
│   │   └── [...path]/route.ts     #   Catch-all proxy to Django backend
│   ├── [locale]/                  # Locale-based routing (en, fr)
│   │   ├── dashboard/             #   Protected dashboard routes
│   │   ├── login/                 #   Login page
│   │   ├── signup/                #   Multi-step signup
│   │   ├── privacy/               #   Privacy policy
│   │   └── layout.tsx             #   Root layout (fonts, providers)
│   └── StoreProvider.tsx          # Redux Provider wrapper
├── components/                     # React components
│   ├── auth/                      #   Login + Signup flows
│   ├── dashboard/                 #   Dashboard views (videos, billing, etc.)
│   ├── sections/                  #   Landing page sections
│   ├── layout/                    #   Navbar, Footer
│   └── ui/                        #   Reusable UI & motion components
├── lib/                            # Shared logic
│   ├── api/                       #   API types, endpoints definitions
│   ├── data/                      #   Mock data (programs, videos, etc.)
│   └── store/                     #   Redux store
│       ├── store.ts               #     Store configuration
│       ├── hooks.ts               #     Typed hooks (useAppDispatch, etc.)
│       └── services/              #     RTK Query API slices
│           ├── api.ts             #       Base API configuration
│           └── authApi.ts         #       Auth endpoints & hooks
├── messages/                       # i18n translations
│   ├── en.json                    #   English
│   └── fr.json                    #   French
├── middleware.ts                   # Auth guard + i18n routing
├── tests/e2e/                     # Playwright E2E tests
└── public/                        # Static assets (images, avatars, vectors)
```

---

## 🏗️ Architecture Overview

### Backend-for-Frontend (BFF) Proxy Pattern

```
┌─────────────┐         ┌─────────────────┐         ┌──────────────┐
│   Browser    │  ──►    │   Next.js API    │  ──►    │ Django API   │
│  (React UI)  │         │   Route Handlers │         │  (Backend)   │
│              │  ◄──    │   (/api/...)     │  ◄──    │              │
└─────────────┘         └─────────────────┘         └──────────────┘
     │                        │
     │  No tokens exposed     │  HttpOnly cookies
     │  to JavaScript         │  set/read server-side
```

- **Client** calls `/api/*` (internal Next.js routes)
- **Proxy** attaches the `auth_token` cookie as `Authorization: Bearer` header
- **Tokens never reach the browser's JavaScript** — immune to XSS theft

### State Management (Redux Toolkit)

```
┌─────────────────────────────────────────────┐
│               Redux Store                    │
│  ┌─────────────────────────────────────┐    │
│  │  RTK Query (baseApi)                │    │
│  │  ├── authApi  (login, register...)  │    │
│  │  └── (future: contentApi, etc.)     │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

- **RTK Query** handles caching, loading states, and error handling automatically
- New API slices can be added via `baseApi.injectEndpoints()` (code splitting)

---

## 📋 Available Scripts

| Command                   | Description                          |
| ------------------------- | ------------------------------------ |
| `npm run dev`             | Start development server (Turbopack) |
| `npm run build`           | Production build                     |
| `npm start`               | Start production server              |
| `npm run lint`            | Run ESLint                           |
| `npm run test:e2e`        | Run Playwright E2E tests             |
| `npm run test:e2e:ui`     | Run tests with Playwright UI         |
| `npm run test:e2e:report` | View last test report                |

---

## 🔐 Security

| Protection            | Implementation                                               |
| --------------------- | ------------------------------------------------------------ |
| **XSS (Token Theft)** | Tokens stored in HttpOnly cookies, never in localStorage     |
| **XSS (Injection)**   | No `dangerouslySetInnerHTML`; all content rendered as text   |
| **CSRF**              | `SameSite: Lax` cookies + same-origin proxy                  |
| **Clickjacking**      | `X-Frame-Options: SAMEORIGIN`                                |
| **HSTS**              | `Strict-Transport-Security` with 2-year max-age              |
| **Content Sniffing**  | `X-Content-Type-Options: nosniff`                            |
| **CSP**               | Content-Security-Policy restricting script/style/img sources |
| **Info Leak**         | `poweredByHeader: false` in Next.js config                   |
| **Dashboard Access**  | Middleware redirects unauthenticated users to login          |

---

## 🎓 Curriculum Overview

| Age Group     | Focus Area                                                   |
| ------------- | ------------------------------------------------------------ |
| **5-7 yrs**   | Needs vs wants, simple saving goals, positive money habits   |
| **8-11 yrs**  | Budgeting, earning & allowance, saving challenges            |
| **12-16 yrs** | Banking & credit, investing basics, entrepreneurial thinking |

---

## ✅ Implementation Status

### Completed ✅

- [x] Authentication (Login + Multi-step Signup)
- [x] Redux Toolkit + RTK Query integration
- [x] BFF Proxy API (HttpOnly cookie auth)
- [x] Multi-language support (EN/FR)
- [x] Dashboard layout + all sub-pages
- [x] Billing & pricing page
- [x] Subscription plan selection
- [x] Responsive design (mobile, tablet, desktop)
- [x] SEO (OG images, sitemap, robots.txt, favicon)
- [x] Security headers (CSP, HSTS, etc.)
- [x] Middleware auth guard
- [x] E2E testing setup (Playwright)

### In Progress 🚧

- [ ] Backend API integration (Django endpoints)
- [ ] Payment gateway (Stripe / Mobile Money)

### Planned 📋

- [ ] Video content delivery system
- [ ] Real-time progress tracking
- [ ] Gamification / Achievement system
- [ ] Admin dashboard
- [ ] Analytics & reporting

---

## 📖 Documentation

| Document                         | Description                                               |
| -------------------------------- | --------------------------------------------------------- |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Architecture, API guide, coding standards, Redux patterns |
| [FEATURES.md](FEATURES.md)       | Detailed feature inventory with component references      |

---

## 🌐 Browser Support

Chrome (latest) · Firefox (latest) · Safari (latest) · Edge (latest)

---

## 📜 License

Proprietary — Zaza Academy

---

<div align="center">
  <p><strong>Zaza Academy</strong> — Empowering Young Minds with Financial Skills</p>
  <p><em>Last Updated: February 8, 2026</em></p>
</div>
