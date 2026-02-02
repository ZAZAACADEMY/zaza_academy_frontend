# Zaza Financial Education - Development Guide

## 🎯 Project Overview

Zaza Academy is a Next.js-based financial education platform for children (ages 5-16). This guide covers setup, architecture, and development best practices.

---

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd zaza-financial-education
npm install
```

### 2. Configure Environment

Create `.env.local` at project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Login Bypass (for UI testing without backend)
NEXT_PUBLIC_BYPASS_LOGIN=true
NEXT_PUBLIC_FORCE_LOGIN_REDIRECT=true
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🏗️ Architecture

### Tech Stack

| Layer                  | Technology              |
| ---------------------- | ----------------------- |
| **Frontend Framework** | Next.js 16 (App Router) |
| **Language**           | TypeScript              |
| **Styling**            | Tailwind CSS 4          |
| **UI Library**         | Lucide React (icons)    |
| **Animations**         | Framer Motion           |
| **Form Validation**    | Zod                     |
| **i18n**               | next-intl               |
| **Testing**            | Playwright (E2E)        |

### Folder Structure

```
app/                          # Next.js 13+ App Router
├── [locale]/                 # Locale segment for i18n
│   ├── (public)/            # Public pages
│   ├── dashboard/           # Protected routes
│   │   ├── billing/         # Billing & pricing
│   │   ├── children/
│   │   ├── programs/
│   │   └── layout.tsx
│   ├── login/
│   ├── signup/
│   └── layout.tsx           # Root layout with providers

components/
├── auth/                      # Auth flows (Login, Signup)
├── dashboard/                 # Dashboard components
├── sections/                  # Landing page sections
├── layout/                    # Global layout (Navbar, Footer)
└── ui/                        # Reusable UI components
    ├── motion/               # Animated components
    ├── Doodles.tsx
    ├── FloatingElements.tsx
    └── ...

lib/
└── api/                       # API client
    ├── client.ts             # Fetch wrapper
    ├── endpoints.ts          # API routes
    ├── auth.ts               # Auth service
    └── types.ts              # API types

messages/
├── en.json                    # English translations
└── fr.json                    # French translations

tests/
└── e2e/                       # Playwright tests

public/                        # Static assets
├── images/
├── vectors/
└── avatars/
```

---

## 🌐 Internationalization (i18n)

### Adding New Translations

1. **Edit translation files** in `/messages`:
   - `en.json` for English
   - `fr.json` for French

2. **Structure**: Namespace-based organization

```json
{
  "ComponentName": {
    "title": "Display text",
    "errors": {
      "field": "Error message"
    }
  }
}
```

3. **Use in components**:

```tsx
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("ComponentName");

  return <h1>{t("title")}</h1>;
}
```

### Routing with Locale

```tsx
// Automatic locale routing
import Link from "@/navigation";

export function MyLink() {
  return <Link href="/dashboard">Go to Dashboard</Link>;
  // Renders: /<current-locale>/dashboard
}
```

---

## 🔐 Authentication Flow

### Login

**File**: `components/auth/Login.tsx`

```
User enters email/password
    ↓
Validation (Zod schema)
    ↓
API call to POST /auth/login/ (or bypass)
    ↓
Store tokens (accessToken, refreshToken) in localStorage
    ↓
Redirect to dashboard
```

**Environment Variables**:

- `NEXT_PUBLIC_BYPASS_LOGIN=true` - Skip API, redirect directly
- `NEXT_PUBLIC_FORCE_LOGIN_REDIRECT=true` - Redirect even if API fails

### Signup (Multi-Step)

**File**: `components/auth/signup/`

**Flow**:

1. Step 1: Account details (firstname, lastname, email, country, password)
2. Step 2: Plan selection (Solo, Family, Family Plus)
3. Step 3: Billing cycle (Monthly or Quarterly)
4. Step 4: Order review
5. Step 5: Payment (Card or Mobile Money)
6. Step 6: Payment processing
7. Step 7: Success confirmation
8. Step 8: Add child profile(s)
9. Step 9: Summary

**State Management**: `SignupContext.tsx` provides shared state across steps.

---

## 💅 Styling Guide

### Tailwind CSS Configuration

**Theme Colors** (from design):

- Primary: `#7F26D9` (purple)
- Secondary: `#F25A73` (pink/red)
- Dark: `#1F1235` (navy)
- Light: `#F5F2FF` (light purple)

### Common Utilities

```tsx
// Rounded corners
rounded-xl       // 12px
rounded-2xl      // 16px
rounded-3xl      // 24px
rounded-full     // 9999px

// Shadows
shadow-sm        // Subtle shadow
shadow-lg        // Large shadow

// Gradients
bg-gradient-to-br from-[#7F26D9] to-[#F46AA3]

// Responsive
lg:flex           // Desktop flex
md:p-8            // Tablet+ padding
```

### Typography

Using custom `font-display` for headings:

```tsx
<h1 className="font-display font-bold text-4xl">My Heading</h1>
```

---

## 🎬 Animation Components

### FadeIn Animation

```tsx
import { FadeIn } from "@/components/ui/motion/FadeIn";

export function MySection() {
  return (
    <FadeIn direction="up" delay={0.2}>
      <h2>Animated Content</h2>
    </FadeIn>
  );
}
```

**Props**:

- `direction`: "up" | "down" | "left" | "right"
- `delay`: Number (seconds)

### Stagger Container

```tsx
import { StaggerContainer, StaggerItem } from "@/components/ui/motion/Stagger";

export function MyList() {
  return (
    <StaggerContainer>
      {items.map((item, i) => (
        <StaggerItem key={i}>
          <div>{item}</div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

---

## 🔗 API Integration

### Making Requests

**File**: `lib/api/client.ts`

```tsx
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

// GET request
const data = await apiClient.get<MyType>(ENDPOINTS.USERS.PROFILE);

// POST request
const response = await apiClient.post<MyType>(ENDPOINTS.AUTH.LOGIN, {
  email,
  password,
});

// With authentication token
const data = await apiClient.get<MyType>(ENDPOINTS.USERS.PROFILE, token);
```

### Error Handling

```tsx
import { ApiError } from "@/lib/api/client";

try {
  const response = await authService.login({ email, password });
} catch (err) {
  if (err instanceof ApiError) {
    console.error("API Error:", err.message, err.status);
  }
}
```

### Available Endpoints

See `lib/api/endpoints.ts` for complete list. Key endpoints:

- `POST /auth/login/`
- `POST /auth/register/`
- `GET /subscription/plans/`
- `GET /content/courses/`

---

## 🧪 Testing

### Running E2E Tests

```bash
# Run all tests
npm run test:e2e

# Watch mode with UI
npm run test:e2e:ui

# View report
npm run test:e2e:report
```

### Writing Tests

**File**: `tests/e2e/my-flow.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test("User can sign up", async ({ page }) => {
  await page.goto("http://localhost:3000/en/signup");

  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "Password123");

  await page.click('button:has-text("Next Step")');

  await expect(page).toHaveURL(/.*step2/);
});
```

---

## 📦 Adding Dependencies

```bash
# Install new package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Check for vulnerabilities
npm audit
```

---

## 🔨 Common Development Tasks

### Create New Page

1. **Create directory** under `app/[locale]/`:

   ```
   app/[locale]/my-page/
   ```

2. **Add `page.tsx`**:

   ```tsx
   export default function MyPage() {
     return <div>My Page</div>;
   }
   ```

3. **Access at**: `http://localhost:3000/[locale]/my-page`

### Create New Component

1. **Create file** in `components/`:

   ```tsx
   // components/MyComponent.tsx
   export function MyComponent() {
     return <div>Component</div>;
   }
   ```

2. **Import and use**:
   ```tsx
   import { MyComponent } from "@/components/MyComponent";
   ```

### Add New Translation

1. **Edit** `messages/en.json` and `messages/fr.json`
2. **Add key**: `"MyNamespace": { "myKey": "value" }`
3. **Use in component**:
   ```tsx
   const t = useTranslations("MyNamespace");
   t("myKey");
   ```

---

## 🐛 Debugging

### Enable Debug Logs

```tsx
// In environment or component
console.log("Debug:", variable);
```

### Browser DevTools

- F12 to open Developer Tools
- **Console**: Check for errors
- **Network**: Monitor API calls
- **Application**: View localStorage tokens

### Next.js Debug Mode

```bash
NODE_OPTIONS='--inspect' npm run dev
```

---

## 📋 Code Style Guidelines

### Component Structure

```tsx
"use client"; // For client components

import { useState } from "react";
import { SomeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

/**
 * Brief description of what the component does
 */
export function MyComponent({ title, onClick }: ComponentProps) {
  const t = useTranslations("ComponentNamespace");
  const [state, setState] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button onClick={onClick}>{t("action")}</button>
    </div>
  );
}
```

### Naming Conventions

- **Files**: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Classes/Types**: `PascalCase`

---

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables (Production)

Update `.env.production` with production values:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zod Validation](https://zod.dev/)
- [Playwright Testing](https://playwright.dev/)

---

## 💬 Getting Help

1. Check existing component examples
2. Review translation files for available keys
3. Check test files for usage examples
4. Refer to component documentation in JSDoc comments

---

**Last Updated**: February 2, 2026
