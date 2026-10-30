# AeroEdge HR

An open-source HR and attendance app for small teams, built with **Expo (React Native)**, **Expo Router** and **Supabase**. Runs on Android, iOS and the web from one codebase.

![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Status: early prototype](https://img.shields.io/badge/status-early%20prototype-orange)
![Expo SDK 54](https://img.shields.io/badge/Expo%20SDK-54-blue)
![Platforms](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-blue)

> **Status: early prototype.** Sign-in and the app's screens and navigation are in place; most screens still show static UI and are not yet connected to the database. See [What works today](#what-works-today) and the [Roadmap](#roadmap). Contributions are welcome.

## Why

Small businesses in India often track attendance and leave in registers or spreadsheets because HR software is priced for big companies. AeroEdge aims to be a free, self-hostable alternative: your own Supabase project, your own data.

## What works today

| Area | Status |
|---|---|
| Email/password sign-in and sign-up (Supabase Auth) | ✅ Working |
| Profile created automatically on sign-up (database trigger) | ✅ Working |
| Session persistence and auto refresh | ✅ Working |
| Loads the signed-in user's profile (`profiles` table) | ✅ Working |
| Tab navigation: Dashboard, Employees, Attendance, Leave, Reports, Profile | ✅ Working |
| Profile screen | ✅ UI with profile data |
| Attendance: Office In / Remote In check-in, check-out, hours worked today | ✅ Working (times come from the server clock) |
| Dashboard, Employees, Leave, Reports | 🟡 UI only (placeholder content) |

## Roadmap

- [x] Create the `profiles` row (first/last name) on sign-up
- [x] Save check-in / check-out to an `attendance_records` table
- [ ] Show today's attendance status on the Dashboard
- [ ] Monthly attendance history on the Attendance screen
- [ ] Employee directory from the database, with search
- [ ] Leave requests with manager approval
- [ ] Monthly attendance and leave reports (CSV export)
- [ ] Role-based access (admin, HR, manager, employee) with Supabase Row Level Security
- [ ] Push notifications for approvals

## Tech stack

- **App:** Expo SDK 54, React Native 0.81, Expo Router (file-based routing), TypeScript
- **Backend:** Supabase (Postgres + Auth)
- **UI:** React Native StyleSheet, Lucide icons

## Getting started

**Requirements:** Node.js 20+, a free [Supabase](https://supabase.com) project, and Expo Go on your phone (or an Android/iOS emulator).

```bash
git clone https://github.com/kaviyarasu-codes/aeroedge_hr_app.git
cd aeroedge_hr_app
npm install
cp .env.example .env    # then fill in your Supabase URL and anon key
npm run dev             # scan the QR code with Expo Go, or press w for web
```

### Environment variables

| Name | Where to find it |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` public key |

Never put the `service_role` key in the app.

### Database setup

Open Supabase → **SQL Editor** and run these files from [`supabase/migrations`](supabase/migrations) in order (or use the Supabase CLI: `supabase db push`). Both are safe to run more than once.

1. **`20261030000000_profiles_and_signup_trigger.sql`**
   - creates the `profiles` table with Row Level Security (each user reads their own profile and can edit name, phone and photo, not their role)
   - creates the profile automatically on sign-up from the first and last name in the form, and backfills existing users
2. **`20261030010000_attendance.sql`**
   - creates `attendance_records` (one record per user per day: mode, check-in and check-out time)
   - adds `check_in(mode, timezone)` and `check_out(timezone)` functions; times come from the database clock, and users can read but not edit their records directly

If **Confirm email** is on (Supabase → Authentication → Sign In / Providers → Email), new users see "Check your email to confirm it" after signing up and can sign in once they've confirmed.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Expo dev server |
| `npm run build:web` | Export a static web build to `dist/` |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | Lint with Expo's ESLint config |

## Project structure

```
app/
  index.tsx          Sign-in / sign-up screen
  _layout.tsx        Root layout (AuthProvider)
  (tabs)/            Dashboard, Employees, Attendance, Leave, Reports, Profile
components/          Button, Input
contexts/            AuthContext (Supabase session + profile)
lib/supabase.ts      Supabase client
lib/attendance.ts    Check-in / check-out helpers
types/               Database types
supabase/migrations/ Database schema (SQL)
```

## Contributing

Issues and pull requests are welcome, especially for items on the Roadmap.

1. Fork the repo and create a branch: `git checkout -b feature/attendance-save`
2. Make your change and run `npm run typecheck`
3. Open a pull request describing what you changed and how you tested it

## Licence

[MIT](LICENSE) © 2026 Kaviyarasu Kanthavel

Built by **Kaviyarasu K**, full-stack and app developer, Coimbatore · [Portfolio](https://kaviyarasu-portfolio.pages.dev) · [GitHub](https://github.com/kaviyarasu-codes)
