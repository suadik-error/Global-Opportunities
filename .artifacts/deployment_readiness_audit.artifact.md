# Deployment Readiness Audit: Global Opportunities

This document outlines the current state of the Global Opportunities workspace and identifies critical blockers and recommended improvements before the project can be considered production-ready.

## 📊 Summary Status: **NOT READY**
The project currently has a functional backend scaffold and beautiful frontend UIs, but they are **disconnected**. Most features in the mobile and admin apps are currently powered by static mock data rather than the live API.

---

## 🏗️ Backend (`kredibble-backend`)

### ✅ Strengths
- Migrated to **Native MongoDB** for better performance and flexibility.
- Standard JWT authentication flow implemented.
- Centralized resource route generator for consistent API behavior.
- Security headers (Helmet) and CORS are enabled.

### 🔴 Critical Blockers
- **Environment Secrets:** `.env` contains placeholders for `JWT_SECRET`, `ADMIN_JWT_SECRET`, etc. These must be replaced with cryptographically secure strings.
- **Data Integrity:** No validation layer (like Zod or Joi). The API accepts any JSON payload that matches the route, which could lead to database corruption.
- **Production Infrastructure:** No `Dockerfile` for the API itself. Only the database is containerized.

### 🛠️ Recommended Improvements
- Implement **Rate Limiting** to prevent brute-force attacks on auth routes.
- Add **Logger** (e.g., Winston or Pino) for production request tracking.
- Create a `db:init` script to create necessary MongoDB indexes (e.g., unique index on `user.email`).

---

## 📱 Mobile App (`kredibble-app`)

### ✅ Strengths
- Comprehensive UI for both Seeker and Hirer flows.
- Multi-step onboarding and profile management implemented in UI.
- Integrated `expo-router` for clean navigation.

### 🔴 Critical Blockers
- **API Integration:** This is the largest gap. `authStore.ts` and `mockProfile.ts` are populated with static data (e.g., "Google LLC", "Enoch Mensah"). Logged-in users will see the mock data instead of their actual database records.
- **Error Handling:** Fetch calls lack robust retry logic or user-friendly offline states.
- **Production Build:** `eas.json` is configured but hasn't been tested with a non-internal distribution profile.

### 🛠️ Recommended Improvements
- Replace all `import { ... } from '../../constants/mockX'` with `useEffect` fetch calls.
- Implement a global `ApiClient` to handle token refresh and base URL management centrally.

---

## 🖥️ Admin Dashboard (`kredibble-admin`)

### ✅ Strengths
- Clean Next.js architecture with dashboard layout.
- Good visibility into platform metrics (UI-wise).

### 🔴 Critical Blockers
- **Data Source:** Every page (Verification, Seekers, Hirers, Reports) imports data from local `mock-*.ts` files. None of the dashboard statistics reflect the actual MongoDB state.
- **Auth Guarding:** Middlewares for protecting admin routes are not fully verified against the JWTs issued by the Express backend.

---

## 🚀 Deployment Checklist

### Phase 1: Integration (Highest Priority)
- [ ] Refactor `kredibble-app` to fetch real data in `HomeScreen`, `ProfileScreen`, and `OpportunityListing`.
- [ ] Refactor `kredibble-admin` to use `fetch` calls in all dashboard views.
- [ ] Implement user profile fetching immediately after login.

### Phase 2: Hardening
- [ ] Replace all `.env` placeholders with real secrets.
- [ ] Configure `CORS_ORIGIN` for the actual production domains.
- [ ] Add request body validation to all POST/PATCH routes in backend.

### Phase 3: Infrastructure
- [ ] Create `Dockerfile` for the Backend and Admin apps.
- [ ] Set up CI/CD pipeline (e.g., GitHub Actions) for automated testing.
- [ ] Verify Atlas connection stability on a standard (non-hotspot) network.

---

> [!CAUTION]
> **Do not attempt to deploy to production in the current state.** Users will be able to sign up, but they will see other users' mock profiles or static placeholder data, creating a broken user experience.
