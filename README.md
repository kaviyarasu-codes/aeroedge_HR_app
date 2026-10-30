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
| Session persistence and auto refresh | ✅ Working |
| Loads the signed-in user's profile (`profiles` table) | ✅ Working |
| Tab navigation: Dashboard, Employees, Attendance, Leave, Reports, Profile | ✅ Working |
| Profile screen | ✅ UI with profile data |
| Attendance screen: live clock, Office In / Remote In buttons | 🟡 UI only (buttons don't save yet) |
| Dashboard, Employees, Leave, Reports | 🟡 UI only (placeholder content) |

## Roadmap

- [ ] Create the `profiles` row (first/last name) on sign-up
- [ ] Save check-in / check-out to an `attendance_records` table
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

The app currently reads one table, `profiles`. Create it in Supabase → SQL Editor:

```sql
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  avatar_url text,
  role text not null default 'employee'
    check (role in ('admin', 'hr', 'manager', 'employee', 'intern')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

Until sign-up creates the profile automatically (see Roadmap), add a row for your user in the Table Editor with the same `id` as the user in Authentication → Users.

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
types/               Database types
```

## Contributing

Issues and pull requests are welcome, especially for items on the Roadmap.

1. Fork the repo and create a branch: `git checkout -b feature/attendance-save`
2. Make your change and run `npm run typecheck`
3. Open a pull request describing what you changed and how you tested it

## Licence

[MIT](LICENSE) © 2026 Kaviyarasu Kanthavel

Built by **Kaviyarasu K**, full-stack and app developer, Coimbatore · [Portfolio](https://kaviyarasu-portfolio.pages.dev) · [GitHub](https://github.com/kaviyarasu-codes)
