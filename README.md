# 🌸 StudyNest — Personal Study Dashboard

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://studynest-amber.vercel.app/auth)

> A beautiful personal productivity dashboard built with **Next.js 14**, **Firebase**, and **Tailwind CSS**.
> Built by a cybersecurity student, for students.

![StudyNest](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=flat-square&logo=firebase)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

## ✨ Features

- **📋 Daily Tasks** — Tagged tasks (study, project, urgent, deadline) with completion tracking
- **⏱ Pomodoro Timer** — Focus/break sessions with session tracking
- **📖 Journal** — Daily reflections with mood tagging & full history
- **🗂 Projects** — Track long-term projects with progress logs
- **📅 Mini Calendar** — Visual task calendar with day-click view
- **📚 Study Topics** — Curated topic list with status badges
- **🔥 Week Streak** — Visual 7-day activity tracker
- **🔐 Auth** — Email/password + Google login via Firebase Auth
- **☁️ Cloud Storage** — All data persisted in Firestore per user

## 🚀 Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Framework | Next.js 14 (App Router) |
| Language  | TypeScript              |
| Styling   | Tailwind CSS            |
| Auth      | Firebase Authentication |
| Database  | Cloud Firestore         |
| Hosting   | Vercel (recommended)    |
| Fonts     | DM Sans, DM Serif Display, Crimson Pro |

## 📦 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/studynest.git
cd studynest
npm install
```

### 2. Set up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g. `studynest`)
3. Enable **Authentication** → Sign-in methods → Email/Password + Google
4. Enable **Firestore Database** → Start in production mode
5. Go to **Project Settings** → Web App → Register app → Copy config

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in your Firebase values in `.env.local`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

Or deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📁 Project Structure

```
studynest/
├── app/
│   ├── auth/page.tsx          # Login / Sign up page
│   ├── dashboard/page.tsx     # Main dashboard
│   ├── layout.tsx             # Root layout + providers
│   ├── page.tsx               # Root redirect
│   └── globals.css            # Global styles + Tailwind
├── components/
│   ├── layout/
│   │   └── Header.tsx         # Sticky navigation header
│   └── features/
│       ├── MiniCalendar.tsx   # Calendar with task indicators
│       ├── PomodoroTimer.tsx  # Focus timer
│       ├── TaskPanel.tsx      # Daily task list
│       ├── ProjectsPanel.tsx  # Project cards
│       ├── JournalPanel.tsx   # Quick journal
│       ├── TopicsPanel.tsx    # Study topics
│       └── WeekStreak.tsx     # Weekly activity
├── lib/
│   ├── firebase.ts            # Firebase init
│   ├── db.ts                  # Firestore CRUD helpers
│   └── AuthContext.tsx        # Auth state provider
├── .env.example               # Environment template
└── README.md
```

## 🔒 Firestore Security Rules

Add these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎨 Design

- Soft rose, lavender, mint, and cream palette
- DM Serif Display for headings, DM Sans for UI, Crimson Pro for journal
- Responsive layout with smooth animations
- Glass-morphism cards with backdrop blur


Built with 🌸 by a student, for students.
