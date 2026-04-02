# RevMap — CLAUDE.md

## Project Overview

RevMap is an AI-powered territory intelligence platform for mid-market B2B 
revenue operations teams. It connects to a company's CRM (Salesforce first, 
HubSpot next), learns what a great-fit account looks like for that specific 
business, and continuously surfaces the right account to the right rep at the 
right time — with the reasoning behind every recommendation pushed directly 
into Salesforce via a Lightning Web Component.

## Tech Stack

- **Frontend**: React + Tailwind CSS (web app), Salesforce LWC (native component)
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI Layer**: Anthropic Claude API
- **CRM Integration**: Salesforce REST API + Bulk API
- **Auth**: Supabase Auth
- **Hosting**: Vercel (frontend), Supabase (backend/edge functions)

## Quick Start

```bash
npm install
cp .env.example .env  # Fill in Supabase + Salesforce credentials
npm run dev
```

## File Structure

```
/src
  /components     — React UI components by domain
  /lib/api        — CRM integration clients + Supabase queries
  /lib/prompts    — All Claude prompt templates (versioned)
  /lib/models     — ICP engine, account scorer, rep-fit model
  /lib/utils      — Supabase client, helpers
  /hooks          — React hooks
  /types          — TypeScript types + Zod schemas
/supabase
  /functions      — Edge functions (crm-sync, score-accounts, etc.)
  /migrations     — SQL migrations
/lwc              — Salesforce Lightning Web Component
```

## Coding Standards

- TypeScript everywhere — no untyped JavaScript
- All AI prompts live in `/src/lib/prompts/` — never hardcoded inline
- All database queries go through Supabase client with RLS
- No direct SQL from frontend — edge functions only
- API responses typed with Zod schemas
- React: functional components, hooks only
