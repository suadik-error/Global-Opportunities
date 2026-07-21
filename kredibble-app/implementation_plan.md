# Implementation Plan - Hiring Talent Post-Login Frontend Flow

This plan outlines the architecture and frontend implementation for the post-login pages of the "Hiring Talent" (Hirer) user.

---

## Proposed Changes

We will introduce a simple global store (`authStore.ts`) to manage the logged-in role (`'seeker' | 'hirer'`). When a user logs in as `hirer`, the five existing tab screens in `src/app/(tabs)` will conditionally switch their layouts to render a highly integrated, premium Hirer suite. This guarantees zero routing issues, retains existing navigation styling, and allows easy switching between Seeker and Hirer flows for testing.

### Global State Store

#### [NEW] [authStore.ts](file:///c:/Users/LEGION/Downloads/Global%20opportunites/kredibble-app/src/constants/authStore.ts)
* Create `authStore.ts` to manage:
  * Logged-in user's role (`seeker` vs `hirer`).
  * Company details (Google, Sarah Jenkins, Recruiter, verified status).
  * Opportunities posted during this session.
  * Communities/Groups managed/created by this Hirer.
  * Mock candidates list with their profiles and match scores.

### Auth & Tab Navigation Layout

#### [MODIFY] [login.tsx](file:///c:/Users/LEGION/Downloads/Global%20opportunites/kredibble-app/src/app/(auth)/login.tsx)
* Update the Login button's `onPress` action to call `authStore.setRole(role)` and route to `/(tabs)` for both Seeker and Hirer roles instead of displaying the placeholder alert for the Hirer.

#### [MODIFY] [_layout.tsx](file:///c:/Users/LEGION/Downloads/Global%20opportunites/kredibble-app/src/app/(tabs)/_layout.tsx)
* Subscribe to `authStore` to dynamically update tab icon colors or styles if needed, keeping navigation consistent.

### Tab Screens Integration

#### [MODIFY] [index.tsx](file:///c:/Users/LEGION/Downloads/Global%20opportunites/kredibble-app/src/app/(tabs)/index.tsx)
* Conditionally render **Hirer Dashboard**:
  * **Top Header**: Organization logo, greeting, and a green badge for "Verification Active" or "Verification Pending".
  * **Analytics Cards Grid**: Visual grid detailing Total Active Posts, Profile Views, and Application Count.
  * **Applicant Pipeline Tracker**: High-fidelity dashboard displaying recruitment pipeline stages: Applied, Shortlisted, Interviewing, and Offered.
  * **Quick Actions**: Stacked action triggers: `+ Post Opportunity`, `+ Create Group`, and `Search Talent`.

#### [MODIFY] [opportunities.tsx](file:///c:/Users/LEGION/Downloads/Global%20opportunites/kredibble-app/src/app/(tabs)/opportunities.tsx)
* Conditionally render **Opportunities Manager**:
  * **Active Listings List**: View posted Jobs, Internships, Events, and Grants along with active applicant counts.
  * **Post Opportunity (Modal/Form)**: Form overlay with inputs: Title, Type (Job, Internship, Event, Grant), Location, Description, and Key Keywords. Submitting adds it to the global store list.
  * **Applicant Review Dashboard**: Click into a listing to see its applicants, sorted by CV match score. Each candidate card displays: Name, Match percentage (e.g. 96%), Resume download, and status tags (Applied, Shortlisted, Interviewing, Offered).

#### [MODIFY] [career.tsx](file:///c:/Users/LEGION/Downloads/Global%20opportunites/kredibble-app/src/app/(tabs)/career.tsx)
* Conditionally render **Talent Directory (Sourcing)**:
  * **Candidate Directory Feed**: Active candidate profiles containing skills chips and bio.
  * **Search & Filters**: Multi-select filters for skills, university, and country matching.
  * **Candidate Actions**: Quick modal displaying full details of a candidate, download resume simulations, and mock communication triggers.

#### [MODIFY] [community.tsx](file:///c:/Users/LEGION/Downloads/Global%20opportunites/kredibble-app/src/app/(tabs)/community.tsx)
* Conditionally render **Community & Group Hub**:
  * **Create Group (Modal/Form)**: Input group title, select topic category (e.g. Tech, Finance, Marketing), description text, and upload mock icon.
  * **Your Managed Groups Feed**: Displays channels owned by this recruiter. Tap a channel to post official job openings or announcements.
  * **Discover Feed**: Browse other public circles to monitor seeker engagement.

#### [MODIFY] [profile.tsx](file:///c:/Users/LEGION/Downloads/Global%20opportunites/kredibble-app/src/app/(tabs)/profile.tsx)
* Conditionally render **Company Profile & Recruiter Settings**:
  * **Profile Header**: Recruiter photo, company association (Google), and role title.
  * **Company Brand Card**: Header cover, brand logo, website link, and industry bio.
  * **Menu Settings**: Options to manage company logo/banner, edit recruiter profile, upload verification IDs, and log out (which resets the role state).

---

## Verification Plan

### Manual Verification
* Start the development server using `npm run web` or standard Expo launcher.
* Login with the **Hiring Talent** role:
  * Confirm it redirects to the new dashboard.
  * Verify the analytics cards and pipeline statistics are rendered.
* Navigate to **Tab 2 (Opportunities)**:
  * Add a new Job opportunity using the form.
  * Click on a listing to inspect the applicant list, verify match scores, and toggle status.
* Navigate to **Tab 3 (Talent Sourcing)**:
  * Apply skills and university filters. Confirm matching seeker cards change dynamically.
* Navigate to **Tab 4 (Communities & Groups)**:
  * Create a new group. Ensure it shows up in "Your Managed Groups" list.
* Navigate to **Tab 5 (Profile)**:
  * Verify the company logo card and logout workflow.
