# GolfHeroes — Play. Give. Win.
 
> A subscription-driven platform combining golf performance tracking, charitable giving, and a monthly prize draw engine. Built with Next.js 16, Supabase, and Stripe.
 
---
 
## Overview
 
GolfHeroes lets golfers track their Stableford scores, enter monthly prize draws using those scores as lottery numbers, and automatically donate a portion of their subscription to a charity of their choice — every single month.
 
---
 
## Features
 
### For Subscribers
- **Score Tracking** — Log up to 5 Stableford scores (1–45). Your scores become your draw numbers
- **Monthly Prize Draws** — Match 3, 4, or 5 numbers to win your share of the prize pool
- **Charity Giving** — Choose any charity; minimum 10% of your subscription donated automatically
- **Subscription Management** — Monthly (£9.99) or Yearly (£99) plans via Stripe
- **Winner Dashboard** — Track your winnings, match history, and payout status
### For Admins
- **User Management** — View all users, subscriptions, and scores
- **Draw Engine** — Run random or score-weighted algorithmic draws; simulate before publishing
- **Jackpot Rollover** — Unclaimed 5-match jackpots roll over to the next month automatically
- **Winner Verification** — Review proof submissions and mark payouts as completed
- **Reports & Analytics** — Subscriber counts, prize pool totals, charity contributions
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| Payments | Stripe (Subscriptions + Webhooks) |
| UI Components | Radix UI + Lucide React |
| Animations | Framer Motion |
| Toasts | Sonner |
| Deployment | Vercel |
 
---
 
## Project Structure
 
```
src/
├── app/
│   ├── (public)/          # Landing page + sections
│   ├── (auth)/            # Login & Signup
│   ├── dashboard/         # Subscriber dashboard
│   │   ├── scores/        # Score management
│   │   ├── draws/         # Draw history
│   │   ├── charity/       # Charity selection
│   │   ├── profile/       # Account settings
│   │   └── subscribe/     # Subscription flow
│   ├── admin/             # Admin panel
│   │   ├── users/         # User management
│   │   ├── draws/         # Draw management
│   │   ├── charities/     # Charity management
│   │   ├── winners/       # Winner verification
│   │   └── reports/       # Analytics
│   └── api/stripe/        # Stripe API routes
├── components/
│   ├── ui/                # Button, Input, Card, Badge
│   ├── layout/            # Navbar, Footer
│   ├── dashboard/         # DashboardSidebar
│   └── admin/             # AdminSidebar
└── lib/
    ├── supabase/          # client, server, admin clients
    ├── stripe.ts          # Stripe instance + plan config
    ├── utils.ts           # Draw engine, prize calc, helpers
    └── types.ts           # TypeScript types
```
 
---
 
## Getting Started
 
### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (new project)
- A [Stripe](https://stripe.com) account (test mode)
- A [Vercel](https://vercel.com) account (new account)
---
 
### 1. Clone & Install
 
```bash
git clone https://github.com/YOUR_USERNAME/golf-heroes.git
cd golf-heroes
npm install
```
 
---
 
### 2. Supabase Setup
 
1. Go to [supabase.com](https://supabase.com) → create a **new project**
2. Go to **SQL Editor** → paste and run the entire contents of `supabase/schema.sql`
3. Go to **Authentication → Providers → Email** → scroll down and turn **OFF** "Confirm email" (to avoid rate limits during development)
4. Copy your **Project URL** and **anon key** from **Settings → API**
---
 
### 3. Stripe Setup
 
1. Go to [stripe.com](https://stripe.com) → **Products** → create two products:
   - **GolfHeroes Monthly** → Recurring, £9.99/month
   - **GolfHeroes Yearly** → Recurring, £99.00/year
2. Copy the **Price ID** for each (starts with `price_...`)
3. Copy your **Publishable key** and **Secret key** from **Developers → API keys**
---
 
### 4. Environment Variables
 
Create a `.env.local` file in the project root:
 
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
 
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
 
---
 
### 5. Run Locally
 
```bash
npm run dev
```
 
Visit [http://localhost:3000](http://localhost:3000)
 
---
 
### 6. Stripe Webhooks (Local)
 
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
 
# Login
stripe login
 
# Forward webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
 
Copy the webhook secret shown and add it as `STRIPE_WEBHOOK_SECRET` in `.env.local`
 
---
 
### 7. Create Admin Account
 
1. Sign up via the app at `/signup`
2. Go to **Supabase → Table Editor → profiles**
3. Find your row and change `role` from `subscriber` → `admin`
4. Log in again — you'll see the **Admin Panel** link in the sidebar
---
 
## Deployment (Vercel)
 
### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
# Then follow GitHub's instructions to push
```
 
### Step 2 — Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project** → **Import Git Repository**
2. Select your `golf-heroes` repo → click **Import**
### Step 3 — Add Environment Variables
In the Vercel project settings, add all variables from your `.env.local`. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g. `https://golf-heroes.vercel.app`)
 
### Step 4 — Production Stripe Webhook
1. Go to **Stripe → Developers → Webhooks → Add endpoint**
2. URL: `https://your-vercel-url.vercel.app/api/stripe/webhook`
3. Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy the signing secret → update `STRIPE_WEBHOOK_SECRET` in Vercel → **Redeploy**
---
 
## Draw System
 
### How It Works
- Every active subscriber's latest 5 Stableford scores are their lottery numbers
- Admin runs a draw each month (random or algorithmic)
- **Random** — 5 numbers picked randomly from 1–45
- **Algorithmic** — weighted by the most frequently occurring scores across all users
- Winners are determined by how many of their numbers match the drawn numbers
### Prize Pool Distribution
 
| Match | Pool Share | Rollover? |
|---|---|---|
| 5 numbers (Jackpot) | 40% | Yes |
| 4 numbers | 35% | No |
| 3 numbers | 25% | No |
 
- Multiple winners in the same tier split the pool equally
- The jackpot rolls over to the next month if nobody matches all 5
---
 
## Score Rules
 
- Maximum **5 scores** stored per user at any time
- Adding a 6th score **automatically removes the oldest** one
- Scores must be between **1 and 45** (Stableford format)
- Only **one score per date** — duplicates are rejected
- Scores are displayed most recent first
---
 
## Security
 
- Row Level Security (RLS) enabled on all Supabase tables
- Users can only read/write their own data
- Admins have elevated access via role check in middleware
- Stripe webhooks verified with signature validation
- All routes protected via `proxy.ts` middleware
---
 
## License
 
This project was built as part of a selection process assignment for Digital Heroes. All rights reserved.
 
---
 
<div align="center">
  Made with ❤️ for charity
</div>
 






