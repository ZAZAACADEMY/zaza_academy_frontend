# Zaza Financial Education — Development Guide

> This guide is for **developers** working on the Zaza Academy frontend. It covers setup, architecture, patterns, and conventions.

---

## 📋 Prerequisites

| Tool    | Version             |
| ------- | ------------------- |
| Node.js | v18+                |
| npm     | v9+                 |
| Git     | Any recent          |
| Editor  | VS Code recommended |

---

## 🚀 Quick Start

```bash
git clone <repository-url>
cd zaza-financial-education
npm install
```

Create `.env.local` at project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

Visit `http://localhost:3000`.

> The frontend runs fine without the Django backend. API calls will return 502 errors which are handled gracefully in dev mode.

---

## 🏗️ Architecture

### Tech Stack

| Layer                    | Technology                         |
| ------------------------ | ---------------------------------- |
| **Framework**            | Next.js 16 (App Router, Turbopack) |
| **Language**             | TypeScript                         |
| **State Management**     | Redux Toolkit + RTK Query          |
| **Styling**              | Tailwind CSS 4                     |
| **Animations**           | Framer Motion                      |
| **Form Validation**      | Zod                                |
| **Internationalization** | next-intl                          |
| **Testing**              | Playwright (E2E)                   |

### Folder Structure

```
app/
├── api/                           # Server-side API Proxy (BFF pattern)
│   ├── auth/
│   │   ├── login/route.ts         # POST - Login proxy (sets HttpOnly cookies)
│   │   └── logout/route.ts        # POST - Logout proxy (clears cookies)
│   └── [...path]/route.ts         # Catch-all reverse proxy to Django
├── [locale]/                      # Locale-based pages (en, fr)
│   ├── layout.tsx                 # Root layout (fonts, NextIntl, StoreProvider)
│   ├── page.tsx                   # Landing page
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── privacy/page.tsx
│   └── dashboard/                 # Protected routes (auth required)
│       ├── layout.tsx             # Dashboard layout with Sidebar
│       ├── page.tsx               # Main dashboard
│       ├── billing/page.tsx
│       ├── children/page.tsx
│       ├── videos/page.tsx
│       ├── live/page.tsx
│       ├── programs/page.tsx
│       ├── settings/page.tsx
│       └── achievements/page.tsx
└── StoreProvider.tsx              # Redux Provider (client component)

components/
├── auth/
│   ├── Login.tsx                  # Login form (uses useLoginMutation)
│   ├── loginValidation.ts         # Zod schema for login
│   └── signup/                    # Multi-step signup flow
│       ├── Signup.tsx             # Step orchestrator
│       ├── SignupContext.tsx       # Shared state across steps
│       ├── Step1Account.tsx       # Account details
│       ├── Step2Plans.tsx         # Plan selection
│       ├── Step3Billing.tsx       # Billing cycle
│       ├── Step4Review.tsx        # Order review
│       ├── Step5Payment.tsx       # Payment (Card / Mobile Money)
│       ├── Step6Processing.tsx    # API call (useRegisterMutation)
│       ├── Step7Success.tsx       # Success confirmation
│       ├── Step8ChildSetup.tsx    # Add child profiles
│       ├── types.ts
│       ├── validation.ts
│       └── constants.ts           # Mobile money providers config
├── dashboard/                     # Dashboard components
│   ├── Sidebar.tsx                # Navigation (uses useLogoutMutation)
│   ├── LogoutModal.tsx
│   ├── StatsCard.tsx
│   ├── ChildrenList.tsx
│   ├── videos/
│   ├── live/
│   ├── billing/
│   ├── children/
│   ├── settings/
│   ├── programs/
│   └── achievements/
├── sections/                      # Landing page sections
├── layout/                        # Navbar, Footer
└── ui/                            # Reusable UI components
    └── motion/                    # FadeIn, Stagger, JellyButton, TiltEffect

lib/
├── api/
│   ├── client.ts                  # Base fetch wrapper (points to /api proxy)
│   ├── endpoints.ts               # Endpoint URL constants
│   ├── auth.ts                    # Legacy auth service (kept for reference)
│   └── types.ts                   # API interfaces (User, AuthResponse, etc.)
├── data/                          # Mock/static data
│   ├── programs.ts
│   ├── videos.ts
│   ├── achievements.ts
│   └── liveSessions.ts
└── store/                         # Redux store
    ├── store.ts                   # Store configuration (configureStore)
    ├── hooks.ts                   # Typed hooks (useAppDispatch, useAppSelector)
    └── services/                  # RTK Query API slices
        ├── api.ts                 # Base API (createApi + fetchBaseQuery)
        └── authApi.ts             # Auth endpoints (login, register, logout, etc.)

messages/                          # i18n translations
├── en.json
└── fr.json

middleware.ts                      # Auth guard + next-intl routing
```

---

## 🔐 Authentication & Security

### How Auth Works (BFF Proxy Pattern)

```
1. User submits login form
     ↓
2. Frontend calls POST /api/auth/login  (Next.js Route Handler)
     ↓
3. Route Handler forwards to Django POST /auth/login/
     ↓
4. Django returns { access_token, refresh_token }
     ↓
5. Route Handler sets HttpOnly cookies:
   - auth_token    (maxAge: 1 day)
   - refresh_token (maxAge: 7 days)
     ↓
6. All subsequent /api/* calls go through catch-all proxy
   which reads the cookie and adds Authorization header
     ↓
7. Tokens NEVER reach browser JavaScript → XSS-immune
```

### Middleware Auth Guard

The `middleware.ts` file runs on every request:

- If the route matches `/dashboard/**` and no `auth_token` cookie exists → redirect to `/login`
- Otherwise → pass through to next-intl routing

### Security Headers (next.config.js)

| Header                      | Value                                          |
| --------------------------- | ---------------------------------------------- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options`           | `SAMEORIGIN`                                   |
| `X-Content-Type-Options`    | `nosniff`                                      |
| `Referrer-Policy`           | `origin-when-cross-origin`                     |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     |
| `Content-Security-Policy`   | Restricts script/style/img/font sources        |

---

## 🗂️ Redux Toolkit & RTK Query

### Overview

We use **RTK Query** as our data-fetching and caching solution. It replaces manual `fetch` calls with declarative hooks.

### Store Setup (`lib/store/store.ts`)

```tsx
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./services/api";

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
```

The store is wrapped in `StoreProvider.tsx` and injected in `app/[locale]/layout.tsx`.

### Base API (`lib/store/services/api.ts`)

```tsx
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User"],
  endpoints: () => ({}), // Injected by feature files
});
```

### Using Hooks in Components

```tsx
import {
  useLoginMutation,
  useGetCurrentUserQuery,
} from "@/lib/store/services/authApi";

// Mutation (POST/PUT/DELETE)
const [login, { isLoading, error }] = useLoginMutation();
await login({ email, password }).unwrap();

// Query (GET) — auto-fetches on mount, caches, refetches on invalidation
const { data: user, isLoading } = useGetCurrentUserQuery();
```

### Available Auth Hooks

| Hook                     | Type     | Endpoint                |
| ------------------------ | -------- | ----------------------- |
| `useLoginMutation`       | Mutation | `POST /auth/login/`     |
| `useRegisterMutation`    | Mutation | `POST /auth/register/`  |
| `useLogoutMutation`      | Mutation | `POST /auth/logout/`    |
| `useGetCurrentUserQuery` | Query    | `GET /auth/users/me/`   |
| `useAddChildMutation`    | Mutation | `POST /users/children/` |

### Adding a New API Slice (for Backend Team)

```tsx
// lib/store/services/contentApi.ts
import { baseApi } from "./api";

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => "/content/courses/",
      providesTags: ["Courses"],
    }),
    getCourseById: builder.query<Course, string>({
      query: (id) => `/content/courses/${id}/`,
      providesTags: (_result, _err, id) => [{ type: "Courses", id }],
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseByIdQuery } = contentApi;
```

Then add `"Courses"` to `tagTypes` in `api.ts`.

---

## 🔗 Backend API Endpoints

All API calls go through the Next.js proxy at `/api/*`. The proxy forwards to the Django backend.

### Auth

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| `POST` | `/auth/login/`         | Login, returns tokens    |
| `POST` | `/auth/register/`      | Register new user        |
| `POST` | `/auth/logout/`        | Invalidate session       |
| `POST` | `/auth/token/refresh/` | Refresh access token     |
| `GET`  | `/auth/users`          | Get current user profile |

### Users

| Method     | Endpoint                 | Description         |
| ---------- | ------------------------ | ------------------- |
| `GET`      | `/users/profile/`        | Get user profile    |
| `PUT`      | `/users/profile/update/` | Update profile      |
| `GET/POST` | `/users/children/`       | List / add children |

### Subscription

| Method | Endpoint                                 | Description                 |
| ------ | ---------------------------------------- | --------------------------- |
| `GET`  | `/subscription/plans/`                   | List available plans        |
| `POST` | `/subscription/create-checkout-session/` | Start checkout              |
| `GET`  | `/subscription/status/`                  | Current subscription status |

### Content

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| `GET`  | `/content/courses/`              | List all courses         |
| `GET`  | `/content/courses/{id}/lessons/` | Lessons for a course     |
| `GET`  | `/content/progress/`             | User's learning progress |

> **Important for Backend Team**: Django must end all URL patterns with a trailing slash `/`. The proxy preserves trailing slashes when forwarding.

---

## 🌐 Internationalization (i18n)

### Adding Translations

1. Edit `messages/en.json` and `messages/fr.json`
2. Use namespace-based keys:

```json
{
  "MyComponent": {
    "title": "Hello",
    "errors": {
      "required": "This field is required"
    }
  }
}
```

3. Use in components:

```tsx
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("MyComponent");
  return <h1>{t("title")}</h1>;
}
```

### Locale-aware Navigation

```tsx
import { Link } from "@/navigation";

// Automatically prepends the current locale
<Link href="/dashboard">Dashboard</Link>;
// Renders: /en/dashboard or /fr/dashboard
```

---

## 💅 Styling Guide

### Theme Colors

| Name             | Hex       | Usage                   |
| ---------------- | --------- | ----------------------- |
| Primary (Purple) | `#7F26D9` | Buttons, links, accents |
| Secondary (Pink) | `#F25A73` | Highlights, badges      |
| Dark             | `#1F1235` | Text, sidebar bg        |
| Cream            | `#F5F2FF` | Page backgrounds        |

### Common Patterns

```tsx
// Rounded pill buttons
className = "px-6 py-3 rounded-full bg-brand-dark text-white font-bold";

// Card
className = "bg-white rounded-3xl shadow-xl p-8";

// Gradient background
className = "bg-gradient-to-br from-[#7F26D9] to-[#F46AA3]";
```

### Typography

```tsx
// Heading (Fredoka font)
<h1 className="font-display font-bold text-4xl">Heading</h1>

// Body (Montserrat font)
<p className="font-sans text-base">Body text</p>
```

---

## 🎬 Animation Components

### FadeIn

```tsx
import { FadeIn } from "@/components/ui/motion/FadeIn";

<FadeIn direction="up" delay={0.2}>
  <h2>Animated Content</h2>
</FadeIn>;
```

### Stagger

```tsx
import { StaggerContainer, StaggerItem } from "@/components/ui/motion/Stagger";

<StaggerContainer>
  {items.map((item, i) => (
    <StaggerItem key={i}>
      <Card {...item} />
    </StaggerItem>
  ))}
</StaggerContainer>;
```

---

## 🧪 Testing

### E2E Tests (Playwright)

```bash
npm run test:e2e          # Run all tests headless
npm run test:e2e:ui       # Interactive Playwright UI
npm run test:e2e:report   # View HTML report
```

### Writing Tests

```typescript
// tests/e2e/my-flow.spec.ts
import { test, expect } from "@playwright/test";

test("User can log in", async ({ page }) => {
  await page.goto("http://localhost:3000/en/login");
  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "Password123!");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*dashboard/);
});
```

---

## 📋 Code Conventions

### Component Structure

```tsx
"use client"; // 1. Directive (if client component)

import { useState } from "react"; // 2. React imports
import { SomeIcon } from "lucide-react"; // 3. Library imports
import { useTranslations } from "next-intl";
import { MyHook } from "@/lib/..."; // 4. Internal imports

interface Props {
  // 5. Types
  title: string;
}

export function MyComponent({ title }: Props) {
  // 6. Component
  const t = useTranslations("Namespace");
  const [state, setState] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
```

### Naming

| Type       | Convention              | Example            |
| ---------- | ----------------------- | ------------------ |
| Components | PascalCase `.tsx`       | `VideoCard.tsx`    |
| Utilities  | camelCase `.ts`         | `validation.ts`    |
| Constants  | UPPER_SNAKE_CASE        | `MOCK_PROGRAMS`    |
| Hooks      | camelCase, `use` prefix | `useLoginMutation` |
| Interfaces | PascalCase              | `UserProfile`      |

---

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables (Production)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

In production:

- Cookies are set with `secure: true` (HTTPS only)
- Demo fallbacks are disabled
- Security headers are enforced

---

## 🐛 Debugging

### Server-Side Logs

The proxy logs backend errors to the terminal where `npm run dev` runs:

- `[Proxy] Backend Error 500 at <url>: <response body>`
- `[Proxy] Critical Error: <error details>`

### Browser DevTools

- **Console**: Check for RTK Query errors, component warnings
- **Network**: Monitor `/api/*` calls, inspect request/response payloads
- **Application > Cookies**: Verify `auth_token` and `refresh_token` presence

### Redux DevTools

Install the [Redux DevTools browser extension](https://chrome.google.com/webstore/detail/redux-devtools) to:

- Inspect RTK Query cache
- Monitor dispatched actions
- Time-travel through state changes

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Tailwind CSS](https://tailwindcss.com)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zod](https://zod.dev/)
- [Playwright](https://playwright.dev/)

---

**Last Updated**: February 8, 2026
