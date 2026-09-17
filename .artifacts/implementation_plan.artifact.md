# Phase 1: Mobile-Backend Integration Plan

This plan outlines the steps to replace static mock data in the `kredibble-app` with live data fetched from the `kredibble-backend` API.

## Goal
Ensure that logged-in users (Seekers and Hirers) see their own data, real opportunities, and live analytics instead of the static placeholders currently defined in `authStore.ts`.

## Proposed Changes

### 1. Refactor `authStore.ts`
- **Current State:** Hardcoded with "Google LLC" and "Enoch Mensah" data.
- **Change:** Initialize with `null` or empty values. Add methods to hydrate the store from API responses.

### 2. Update `api.ts`
- **Change:** Add generic `get` method to the request helper. Add specific endpoints for fetching profile data and dashboard summary.

### 3. Refactor `HomeScreen` (`src/app/(tabs)/index.tsx`)
- **Change:** Add `useEffect` to fetch data on mount if a token is present.
- **Seeker Flow:** Fetch latest 4-5 opportunities from `/api/opportunities`.
- **Hirer Flow:** Fetch summary analytics from `/api/dashboard/summary` (or a user-specific version).

### 4. Refactor `ProfileScreen` (`src/app/(tabs)/profile.tsx`)
- **Change:** Fetch the user's specific profile (Seeker or Hirer details) from the backend.

## Verification Plan

### Automated Tests
- Not applicable yet (no testing suite installed).

### Manual Verification
1. Log in as a Seeker (enoch.mensah@gmail.com / password123).
2. Verify the Home screen shows "Hello Enoch" (if implemented) or correct personalized data.
3. Log in as a Hirer (s.jenkins@google.com / password123).
4. Verify the Dashboard Analytics cards match the data in MongoDB.
