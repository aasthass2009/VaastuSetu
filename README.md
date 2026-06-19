# VaastuSetu

**An AI-guided Vaastu Shastra platform that helps people score, understand, and improve their homes.**

VaastuSetu lets users analyse their home layout against classical Vaastu principles, generate branded PDF reports, book expert consultants, and subscribe to a Pro plan — all in a mobile-first Progressive Web App.

---

## Features

| Feature | Description |
|---|---|
| **Vaastu Score Engine** | Rule-based engine scores rooms by direction, element, and usage against Vaastu principles |
| **Saved Homes & Dashboard** | Users save multiple properties; dashboard shows homes, reports, and upcoming bookings |
| **Branded PDF Reports** | Server-rendered PDFs with score breakdown, room-level recommendations, and brand styling |
| **Consultant Marketplace** | Browse, filter, and book verified Vaastu consultants; 20 % platform commission tracked |
| **Payments (Razorpay)** | ₹499 one-time report unlock or ₹299/month Pro subscription via Razorpay (test mode by default) |
| **Billing & Orders** | Order history, per-order receipts, subscription status, and self-serve cancellation |
| **PWA + Compass** | Installable PWA with service worker; built-in compass tool for on-site directional checks |
| **AI Chatbot** | RAG-powered chatbot (GPT-4o mini + pgvector) for Vaastu Q&A — **requires OpenAI credits and running `npm run kb:build` to activate** |
| **Admin Panel** | Manage consultants, listings, and bookings at `/admin` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Database | PostgreSQL with pgvector extension |
| ORM | Prisma (custom output: `lib/generated/prisma/`) |
| Auth | Clerk (social + email, webhooks for user sync) |
| Payments | Razorpay (test mode keys ship in `.env.example`) |
| AI | OpenAI SDK (`gpt-4o-mini`, `text-embedding-3-small`) |
| PDF | PDFKit (server-side, streamed) |
| PWA | Web App Manifest + custom service worker |

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **Docker Desktop** (for the local PostgreSQL + pgvector container)
- A [Clerk](https://clerk.com) account (free tier is fine)
- A [Razorpay](https://razorpay.com) account in test mode

### 1. Clone and install

```bash
git clone https://github.com/your-username/vaastusetu.git
cd vaastusetu
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in every value in `.env.local` — see the [Environment Variables](#environment-variables) section below. **Never commit `.env.local`.**

### 3. Start the PostgreSQL container

The project requires PostgreSQL with the `pgvector` extension. Run it via Docker:

```bash
docker run -d \
  --name vaastu-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vaastusetu \
  -p 5434:5432 \
  pgvector/pgvector:pg16
```

Your `DATABASE_URL` should then be:

```
postgresql://postgres:postgres@localhost:5434/vaastusetu
```

### 4. Run migrations and seed

```bash
npx prisma migrate deploy   # applies all migrations
npm run db:seed             # seeds consultants, room guides, and sample data
```

> After any `prisma migrate dev` or `prisma generate` you must **restart the dev server** so Next.js picks up the regenerated client.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values below. **Do not commit real keys to git.**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (include port `5434` for local Docker) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key — safe to expose to the browser |
| `CLERK_SECRET_KEY` | Clerk secret key — server only |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Set to `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Set to `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Set to `/dashboard` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Set to `/dashboard` |
| `CLERK_WEBHOOK_SECRET` | Signing secret from Clerk Webhooks dashboard (user sync) |
| `OPENAI_API_KEY` | OpenAI API key — required only for the AI chatbot feature |
| `RAZORPAY_KEY_ID` | Razorpay key ID — use `rzp_test_…` keys for test mode |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret — server only, never sent to the browser |

> **Razorpay live mode:** Before going live, complete KYC at [razorpay.com](https://razorpay.com) and replace the `rzp_test_` keys with `rzp_live_` keys.

---

## Project Structure

```
vaastusetu/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # Route handlers (homes, payments, chat, webhooks…)
│   ├── billing/            # Billing page + per-order receipt pages
│   ├── consultants/        # Marketplace listing and booking flow
│   ├── dashboard/          # User dashboard
│   ├── homes/              # Saved homes list and detail pages
│   ├── vaastu-score/       # Score wizard (multi-step form)
│   ├── compass/            # PWA compass tool
│   ├── admin/              # Admin panel
│   └── room-guides/        # Static Vaastu room guides
│
├── components/
│   ├── billing/            # CancelSubscriptionButton
│   ├── payment/            # RazorpayCheckout, ReportDownloadButton
│   ├── chat/               # Floating AI chatbot widget
│   ├── layout/             # Header, footer
│   └── ui/                 # shadcn/ui primitives
│
├── lib/
│   ├── vaastu/             # Scoring engine (rules, types, engine.ts)
│   ├── pdf/                # PDF generation helpers
│   ├── generated/prisma/   # Auto-generated Prisma client (do not edit)
│   ├── db.ts               # Prisma client singleton
│   ├── razorpay.ts         # Razorpay client singleton
│   └── sync-user.ts        # Clerk → DB user sync helper
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # SQL migration history
│   └── seed.ts             # Seed script
│
├── scripts/
│   └── build-knowledge-base.ts  # Embeds Vaastu content into pgvector for RAG
│
└── public/
    └── sw.js               # PWA service worker
```

---

## Useful Scripts

```bash
npm run dev          # Start Next.js development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check

npm run db:seed      # Seed the database with sample data
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run kb:build     # Build AI knowledge base (requires OPENAI_API_KEY + credits)

npm run test:vaastu  # Run the Vaastu scoring engine unit tests
```

---

## Deployment

VaastuSetu is a standard Next.js application. The recommended setup:

1. **Host:** [Vercel](https://vercel.com) (zero-config Next.js deployment)
2. **Database:** [Neon](https://neon.tech) or [Supabase](https://supabase.com) — both provide hosted PostgreSQL with the `pgvector` extension
3. **Environment variables:** Set all variables from `.env.example` in your host's dashboard. Never commit real keys.
4. **Razorpay:** Switch `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` to `rzp_live_` keys after completing KYC.
5. **OpenAI:** Set `OPENAI_API_KEY` and run `npm run kb:build` once against your production database to populate the vector knowledge base.
6. **Clerk webhooks:** Update your Clerk webhook endpoint URL to your production domain and set `CLERK_WEBHOOK_SECRET` accordingly.

> **Note on `pg` / PDFKit:** `next.config.mjs` marks `pg`, `pdfkit`, and the Prisma adapter as `serverExternalPackages` so they run in Node.js rather than the edge runtime. Ensure your host targets Node.js (not the Edge Runtime).

---

## Disclaimer

Vaastu Shastra is a traditional Indian system of architecture and spatial arrangement. VaastuSetu offers respectful, educational guidance based on classical Vaastu principles. It is not a substitute for professional architectural advice, and no specific outcomes or guarantees are implied. Use the scores and recommendations as one perspective among many when making decisions about your home.
