# Faro — Financial Literacy for Immigrants

> Maps home-country financial tools (CIBIL scores, tandas, UPI, paluwagan) to US equivalents so immigrants can hit the ground running.

**Stack:** Next.js 14 · Tailwind CSS · AWS Bedrock (Claude Sonnet) · AWS Neptune (Gremlin) · Vercel

---

## Prerequisites

Make sure you have these installed before cloning:

| Tool | Version | Check |
|---|---|---|
| Node.js | 18 or higher | `node -v` |
| npm | 9 or higher | `npm -v` |
| Git | any | `git --version` |

You will also need:
- An **AWS account** with access to Bedrock and Neptune
- AWS IAM credentials (`AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`) with the permissions below
- A running **AWS Neptune** cluster (or ask a teammate for the endpoint)

**Required IAM permissions:**
```
bedrock:InvokeModel
neptune-db:connect
neptune-db:ReadDataViaQuery
neptune-db:WriteDataViaQuery
```

---

## Setup (first time)

### 1. Clone the repo

```bash
git clone git@github.com:anniegao2013/ai4good2026.git
cd ai4good2026
```

### 2. Install dependencies

```bash
npm install
```

This installs everything in `package.json` — Next.js, Tailwind, AWS SDKs, Gremlin, and all dev tooling. No separate install step needed.

### 3. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here

NEPTUNE_ENDPOINT=your-cluster.cluster-xxxx.us-east-1.neptune.amazonaws.com
NEPTUNE_PORT=8182

BEDROCK_REGION=us-east-1
```

> `.env.local` is in `.gitignore` — never commit credentials.

### 4. Seed the Neptune knowledge graph (one-time, per cluster)

Only one person on the team needs to do this. It loads all the financial concept nodes into Neptune.

```bash
npm run seed
```

> If Neptune isn't set up yet, the app still works — it falls back to a hardcoded local knowledge graph automatically.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app has three pages:
- `/` — landing page
- `/onboarding` — 6-question flow
- `/result` — personalized financial map

---

## npm scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server at localhost:3000 |
| `npm run build` | Production build (runs lint + type-check) |
| `npm run start` | Run the production build locally |
| `npm run lint` | ESLint check |
| `npm run seed` | Seed Neptune with financial concept nodes (run once) |

---

## Dependencies

### Runtime
| Package | Why |
|---|---|
| `next@14` | App Router, server components, API routes |
| `react`, `react-dom` | UI framework |
| `@aws-sdk/client-bedrock-runtime` | Call Claude Sonnet via AWS Bedrock |
| `@aws-sdk/client-neptune-graph` | AWS Neptune client |
| `gremlin` | Gremlin driver for Neptune graph queries (seed script only) |

### Dev only
| Package | Why |
|---|---|
| `typescript` | Type checking |
| `tailwindcss` | Utility CSS |
| `postcss` | Tailwind processing |
| `eslint`, `eslint-config-next` | Linting |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/gremlin` | Type definitions |

---

## Project structure

```
/app
  page.tsx                — landing page
  /onboarding/page.tsx    — 6-question onboarding flow
  /result/page.tsx        — translation card + roadmap
  /api
    /parallel/route.ts    — main API: Neptune → Bedrock → JSON
    /graph/route.ts       — lightweight direct Neptune queries

/components
  Skyline.tsx             — fixed SVG city skyline (all pages)
  PillButton.tsx          — selectable pill option
  QuestionCard.tsx        — question + "why we ask" wrapper
  TranslationRow.tsx      — home concept → US equivalent row
  BuildingBlock.tsx       — priority card (sections B + C of result)
  ProgressBar.tsx         — onboarding progress indicator

/lib
  types.ts                — shared TypeScript types
  knowledge-graph.ts      — hardcoded fallback graph (23 concepts, 5 countries)
  neptune.ts              — Neptune HTTP/Gremlin query helpers
  bedrock.ts              — Bedrock InvokeModel wrapper
  seed-graph.ts           — one-time Neptune population script
```

---

## How the data flow works

```
User fills out onboarding (6 questions)
        ↓ stored in localStorage as faro_profile
POST /api/parallel
        ↓ queries Neptune by country + tool categories
        ↓ passes concept nodes to Bedrock (Claude Sonnet)
        ↓ falls back to local knowledge-graph.ts if either fails
Result page reads faro_result from localStorage
```

---

## Deployment (Vercel)

1. Push to `main` — Vercel auto-deploys
2. In the Vercel dashboard, add all variables from `.env.local` under **Settings → Environment Variables**
3. Make sure Neptune's security group allows inbound TCP on port 8182 from Vercel's IP ranges (or use a VPC + NAT)

---

## Troubleshooting

**`Neptune query failed`** — Check that `NEPTUNE_ENDPOINT` is correct and your IAM user has `neptune-db:*` permissions. The app falls back to the local knowledge graph automatically.

**`Bedrock call failed`** — Ensure `bedrock:InvokeModel` is in your IAM policy and `BEDROCK_REGION` matches where you've enabled the `anthropic.claude-sonnet-4-5` model.

**`npm run seed` fails** — Make sure `NEPTUNE_ENDPOINT` is set in `.env.local` and Neptune is reachable from your machine (check security group / VPN).

**Build error on Windows** — Use Git Bash or WSL. PowerShell path separators can cause issues with `ts-node`.
