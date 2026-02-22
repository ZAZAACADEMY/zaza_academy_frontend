# Project Overview

This project is a web application for **Zaza Academy**, a financial literacy education platform for children aged 5-16.

It is built with a modern frontend stack, including:
- **Framework**: Next.js 14 (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query
- **Animations**: Framer Motion
- **Internationalization (i18n)**: `next-intl` for English and French language support.
- **Testing**: Playwright for End-to-End (E2E) tests.

The Next.js application integrates directly with a Django backend. Authentication is handled using client-side stored tokens (e.g., in `localStorage`), which are sent with requests via `Authorization: Bearer` headers.

# Building and Running

## Prerequisites
- Node.js v18+
- npm v9+

## Key Commands

The following scripts are defined in `package.json`:

- **Run development server**:
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:3000`.

- **Create a production build**:
  ```bash
  npm run build
  ```

- **Run the production server**:
  ```bash
  npm start
  ```

- **Run linters**:
  ```bash
  npm run lint
  ```

- **Run End-to-End (E2E) tests**:
  ```bash
  npm run test:e2e
  ```

## Environment Variables
Create a `.env.local` file in the project root to configure the backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
The application is designed to function with graceful fallbacks even if the backend is not running, particularly for the signup flow in development mode.

# Development Conventions

- **Project Structure**: The project follows the standard Next.js App Router structure.
  - `app/[locale]`: Contains locale-based routes for different pages (`dashboard`, `login`, `signup`, etc.).

  - `components`: Contains reusable React components, organized by feature (`auth`, `dashboard`) or type (`layout`, `ui`).
  - `lib`: Holds shared logic, including API definitions (`lib/api`) and the Redux store (`lib/store`).
  - `messages`: Stores i18n translation files (`en.json`, `fr.json`).
  - `tests/e2e`: Contains Playwright test specifications.

- **State Management**: Global state is managed by Redux Toolkit. Asynchronous data fetching and caching are handled by RTK Query.

- **Styling**: Utility-first CSS is implemented with Tailwind CSS.

- **Coding Style**: The project uses TypeScript for type safety and ESLint for code quality and consistency.

- **Authentication**: Authentication is now handled client-side using tokens stored in `localStorage`. These tokens are automatically attached to API requests. The `middleware.ts` is solely responsible for internationalization routing; dashboard protection is implemented client-side in the dashboard layout.
