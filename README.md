<div align="center">

# kova.

**Social financial accountability — powered by AI and loss aversion.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=flat-square&logo=supabase)](https://supabase.com)
[![Claude API](https://img.shields.io/badge/AI-Claude%20Haiku-orange?style=flat-square)](https://anthropic.com)

*Built for Youth Code x AI Hackathon 2026 · Track 01 — Money, Jobs & AI (KPMG-Anchored)*

</div>

---

## What is Kova?

Kova turns your friend group into a financial accountability system. It uses **loss aversion**, **social commitment contracts**, and **AI-generated weekly challenges** to help people follow through on financial goals they already want to achieve.

Every existing financial app solves the knowledge problem. Mint tells you where your money goes. YNAB gives you a framework. Revolut shows you your spending.

None of them solve the behaviour problem.

**Kova does.**

> *Knowing what to do was never the problem.*

---

## How it works

```
1. Create a goal group
   Set a savings target, name your goal, pick your weekly stake

2. Invite friends with a single-use code
   Each member joins your goal group — skin in the game, together

3. AI generates your weekly challenge
   Personalised to your spending category and savings goal

4. Complete within 7 days

   ✓ Complete  →  Stake pool unlocks as a partner voucher reward
   ✗ Miss       →  Your stake is held in your Kova wallet for 30 days, then returned
   ↻ Reschedule →  Challenge timer resets, no penalty (1× per month)

5. Your group sees your streak — not your financial data
   Repeat weekly.
```

---

## The behavioural science

Kova stacks three proven mechanisms:

| Lever | Mechanism | Evidence |
|---|---|---|
| **Loss aversion** | Stake is pre-committed — missing feels like losing something already owned | Losses hurt ~2× more than equivalent gains (Kahneman & Tversky) |
| **Social accountability** | Group sees your streak status every week | 95% goal completion with a specific accountability check-in (ASTD) |
| **Pre-commitment** | Stake is locked before the week starts | Binds the future self — the decision to follow through is already made |

---

## The ethical distinction

When you miss a challenge, your stake goes into your **own locked Kova wallet** — held securely at a partner bank. Not to a charity. Not to your friends. Not to Kova.

- The money is still yours
- It is still building toward your goal
- It is locked for 30 days (the sting is illiquidity, not loss)
- After 30 days it unlocks and becomes withdrawable

**The worst-case scenario is still progress.**

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | TypeScript · React 18 · Vite 6 |
| Styling | Tailwind CSS v4 · inline styles |
| Auth | Supabase Auth |
| Database | Supabase (Postgres) |
| AI challenge engine | Claude API (`claude-haiku-4-5-20251001`) |
| Animations | Motion (Framer Motion) |
| Deployment | Vercel |

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
git clone https://github.com/your-org/kova.git
cd kova
npm install
```

### Environment variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project structure

```
src/
├── app/
│   ├── App.tsx                      # Root — auth phase routing, screen navigation
│   ├── context/
│   │   ├── AuthContext.tsx           # Supabase session + user metadata
│   │   ├── QuestContext.tsx          # Active AI challenge state
│   │   └── GroupContext.tsx          # Goal groups — members, invite codes
│   └── components/
│       ├── auth/                     # Login, register, reset password screens
│       ├── onboarding/               # Bank connection + profile setup
│       ├── layout/
│       │   └── DesktopSidebar.tsx    # Sidebar nav for desktop (≥1024px)
│       └── vault/
│           ├── Shared.tsx            # Design tokens, shared components, nav types
│           ├── DashboardScreen.tsx   # Home — balance, streak, goals, goal groups
│           ├── QuestDetailScreen.tsx # AI challenge detail, progress, actions
│           ├── QuestGeneratorSheet.tsx # Claude-powered challenge generator
│           ├── GroupScreen.tsx       # Goal group list + detail + invite flow
│           ├── InsightsScreen.tsx    # Spending patterns, upcoming challenges
│           ├── WalletScreen.tsx      # Kova wallet — locked / available / vouchers
│           ├── NotificationsScreen.tsx # Deadline reminders and group nudges
│           ├── MemberProfileScreen.tsx # 12-week history grid per member
│           ├── ProfileScreen.tsx     # Account settings, bank connection
│           └── NewVaultScreen.tsx    # Create goal group — goal, stake, invite
├── lib/
│   └── anthropic.ts                 # Claude API client — challenge generation
└── styles/
    └── index.css
```

---

## AI challenge engine

The challenge engine generates personalised weekly financial challenges using the Claude API (`claude-haiku-4-5-20251001`).

**Input:**
```typescript
{
  weeklyBudget: number,
  overspendCategory: string,   // e.g. "Food & Dining"
  savingsGoal: string,         // e.g. "Emergency fund" or custom text
}
```

**Output:**
```typescript
{
  title: string,               // Max 10 words, active voice
  rationale: string,           // References the user's actual numbers
  category: string,
  targetAmount: number,
  unit: "currency" | "count" | "percentage",
  reward: string,              // Voucher value — scales with difficulty
  stake: string,               // What locks on a miss
  steps: [{ title, description }],
  difficulty: "easy" | "medium" | "hard",
  estimatedSavings: number
}
```

API calls are proxied through Vite's dev server (`/anthropic/v1/messages → https://api.anthropic.com`) to avoid browser CORS restrictions. In production, proxy through a Supabase Edge Function to keep the API key off the client.

---

## Goal groups

A goal group is created when a user launches a goal. Each group has:

- A **goal name** and weekly stake amount
- A **single-use invite code** — shared with friends, rotates after each join
- A **members list** with streak dots and savings status
- A **pool history** — completed weeks, missed stakes, rescheduled challenges

One user account can create and belong to multiple goal groups simultaneously. Group state is scoped per authenticated user and resets on logout.

---

## Wallet

The Kova wallet tracks three balance states:

| State | Description |
|---|---|
| **Available** | Funds ready to withdraw to your linked bank |
| **Locked** | Missed-challenge stake — held for 30 days, then released |
| **Voucher** | Partner reward earned by completing a challenge |

Withdrawals go through a 4-step flow: Amount → Review → Processing → Success, with a 3-business-day arrival estimate.

---

## Key product rules

**Streaks**
- 🟢 Green pip — completed within 7 days
- 🔴 Red pip — missed, no reschedule used
- 🟡 Amber pip — rescheduled (no penalty)
- ⚪ Empty pip — current or upcoming week

**Reschedule**
- 1 per calendar month per user
- Resets the 7-day timer from date of request
- Group sees "Rescheduled" status — reason is private

**Privacy**
- Group sees: streak status, pip history, completion badge
- Group never sees: balance, transaction history, challenge details, saved amounts

**Invite codes**
- Single-use — rotates after each successful join
- Self-join prevention — entering your own code shows an error
- No duplicate members — same user cannot join the same group twice

---

## Screens

| Screen | Purpose |
|---|---|
| Dashboard | Balance, streak, goal progress cards, goal groups list |
| Challenge detail | AI challenge, progress tracker, complete / reschedule actions |
| Goal Groups | List of all goal groups + detail view per group |
| Create goal group | Goal name, target amount, deadline, stake configuration |
| Insights | Spending patterns, upcoming challenge previews |
| Wallet | Locked / available / voucher balances, withdrawal flow |
| Notifications | Deadline reminders, group nudges |
| Member profile | 12-week challenge history grid |

---

## Licence

MIT

---

<div align="center">
  <sub>Built for <a href="https://youthcodexai.netlify.app/">Youth Code x AI Hackathon 2026</a> · Track 01 KPMG-anchored</sub>
</div>
