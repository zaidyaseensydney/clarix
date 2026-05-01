# Clarix — AI Tutoring Platform for Australian Students

A modern AI-powered tutoring experience aligned to the Australian curriculum, built for students from Year 1 to Year 12 and trusted by parents.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** — custom Clarix design tokens
- **Radix UI** — accessible headless components
- **Groq API** — `llama-3.3-70b-versatile` for AI tutoring and quiz generation
- **react-markdown** + remark-gfm — rendered markdown in chat
- **Sonner** — toast notifications

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and add your Groq API key:

```bash
cp .env.example .env.local
```

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get a Groq API key at [console.groq.com](https://console.groq.com).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login page |
| `/signup` | Multi-step signup (student or parent) |
| `/dashboard` | Student dashboard |
| `/tutor` | AI tutor chat (accepts `?subject=&topic=` params) |
| `/progress` | Progress tracking |
| `/parent` | Parent dashboard |
| `/parent/tutor` | Parent advisor chat (accepts `?child=&q=` params) |
| `/pricing` | Pricing page |

## API Routes

| Route | Purpose |
|-------|---------|
| `POST /api/tutor` | Groq-powered tutor/advisor chat |
| `POST /api/quiz` | Generate quiz questions |
| `POST /api/evaluate` | Evaluate short/long-form answers |

All API routes require `GROQ_API_KEY` to be set. The key is never exposed to the client.

## Features

- **Australian curriculum aligned** — ACARA outcomes mapped per topic
- **AI tutor chat** — guided hints, explanations, and markdown responses
- **Quiz system** — MCQ, short answer, and long answer with AI evaluation
- **Progress tracking** — weekly charts, topic breakdown, strengths/weaknesses
- **Parent dashboard** — per-child stats, report cards, activity feed, AI insights
- **Parent advisor** — dedicated AI advisor with child context
- **Persona switcher** — dev tool (bottom right) to switch between student/parent views
- **Pricing page** — monthly/yearly toggle, FAQ accordion

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Groq API key for AI features |

## Project Structure

```
app/
  api/           # Server-only API routes (Groq calls)
  dashboard/     # Student dashboard
  login/         # Login page
  signup/        # Multi-step signup
  tutor/         # AI tutor page
  progress/      # Progress page
  parent/        # Parent dashboard + advisor
  pricing/       # Pricing page
components/
  clarix/        # Clarix-specific components (header, footer, persona switcher)
  ui/            # Radix UI-based design system components
lib/
  context.tsx    # ClarixProvider + persona state
  groq-prompts.ts # Centralized prompt strings
  mock-data.ts   # Mock data for demo
  subject-topics.ts # Subject/topic/syllabus data
  types.ts       # TypeScript types
  utils.ts       # cn() utility
```
