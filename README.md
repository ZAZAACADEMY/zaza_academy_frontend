# Zaza Financial Education Platform

<div align="center">
  <h2>Financial Literacy Education for Children Ages 5-16</h2>
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

### 🔐 Authentication System

- Secure login with email and password
- Multi-step signup flow with email verification
- Support for multiple account types
- Token-based authentication

### 📚 Multi-Step Signup

1. Account creation with email and password
2. Plan selection (Standard, Premium, Family Bundle)
3. Billing cycle choice (Monthly or Quarterly)
4. Order review and confirmation
5. Secure payment processing (Card or Mobile Money)
6. Child profile setup (name, age, gender, avatar)
7. Family summary and registration completion

### 💳 Pricing & Subscription Management

- **Three subscription tiers** with distinct features
- Flexible payment options (3-payment installments available)
- Dashboard showing current plan, usage, and billing history
- Easy upgrade path to higher tiers

### 📊 Dashboard

- Welcome personalized to user
- Statistics overview (progress, videos watched, achievements, study time)
- Children management
- Recent activity tracking
- Achievements display

### 🌍 Multi-Language Support

- English and French interfaces
- Fully translated content across all pages
- Automatic language detection and switching

### 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface

### 🎨 Modern UI/UX

- Smooth animations and transitions
- Engaging visual design with gradient accents
- Accessible color schemes and typography
- Interactive components with visual feedback

---

## 🛠️ Tech Stack

| Component                | Technology            |
| ------------------------ | --------------------- |
| **Framework**            | Next.js 16 (React 19) |
| **Language**             | TypeScript            |
| **Styling**              | Tailwind CSS 4        |
| **Animations**           | Framer Motion         |
| **Icons**                | Lucide React          |
| **Form Validation**      | Zod                   |
| **Internationalization** | next-intl             |
| **Testing**              | Playwright E2E        |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd zaza-financial-education

# Install dependencies
npm install

# Configure environment (optional)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Testing/Demo Mode
NEXT_PUBLIC_BYPASS_LOGIN=true
NEXT_PUBLIC_FORCE_LOGIN_REDIRECT=true
```

---

## 📖 Documentation

- **[FEATURES.md](FEATURES.md)** - Complete feature documentation
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guide and architecture

---

## 📁 Project Structure

```
zaza-financial-education/
├── app/                        # Next.js App Router
│   └── [locale]/              # Locale-based routing
│       ├── dashboard/         # Protected dashboard routes
│       ├── login/             # Login page
│       ├── signup/            # Multi-step signup
│       └── layout.tsx         # Root layout
├── components/                 # Reusable React components
│   ├── auth/                  # Authentication flows
│   ├── dashboard/             # Dashboard components
│   ├── sections/              # Landing page sections
│   └── ui/                    # UI primitives and animations
├── lib/                       # Utility functions
│   └── api/                   # API client and endpoints
├── messages/                  # i18n translations
│   ├── en.json               # English strings
│   └── fr.json               # French strings
├── tests/                     # End-to-end tests
│   └── e2e/
├── public/                    # Static assets
├── FEATURES.md                # Feature documentation
├── DEVELOPMENT.md             # Development guide
└── README.md                  # This file
```

---

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run linter

# Testing
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run tests with UI
npm run test:e2e:report # View test report
```

---

## 🎓 Curriculum Overview

### Age Groups

**Ages 5-7**: Money Basics for Little Learners

- Needs vs wants sorting
- Simple saving goals
- Positive money habits

**Ages 8-11**: Smart Money Explorers

- Budgeting fundamentals
- Earning and allowance
- Saving challenges

**Ages 12-16**: Teen Wealth Builders

- Banking and credit
- Investing basics
- Entrepreneurial thinking

---

## ✅ Implementation Status

### Completed

- [x] Authentication (Login/Signup)
- [x] Multi-language support (EN/FR)
- [x] Dashboard layout
- [x] Billing & pricing page
- [x] Plan selection
- [x] Responsive design
- [x] E2E testing setup

### In Progress

- [ ] Backend API integration
- [ ] Payment gateway

### Planned

- [ ] Video content system
- [ ] Progress tracking
- [ ] Gamification/Achievements
- [ ] Admin dashboard

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📞 Support

For development help, see [DEVELOPMENT.md](DEVELOPMENT.md)  
For feature documentation, see [FEATURES.md](FEATURES.md)

---

## 📜 License

Proprietary - Zaza Academy

---

<div align="center">
  <p><strong>Zaza Academy</strong> - Empowering Young Minds with Financial Skills</p>
  <p><em>Last Updated: February 2, 2026</em></p>
</div>
