# Nutrisi AI Frontend

A web app to scan food photos and estimate nutrition using AI vision.

This folder contains:
- React frontend (Vite + TypeScript)
- Vercel serverless API routes for analysis and history
- In-memory nutrition mapping + label normalization utilities

## Main Features

- Food image upload and AI label detection (Gemini Vision)
- Label normalization to known food aliases
- Nutrition estimation (calories, protein, fat, carbs)
- Scan history list and detail page
- Responsive UI with Tailwind + shadcn/ui + Framer Motion

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (Radix primitives)
- Framer Motion
- TanStack Query
- Vercel Serverless Functions
- Google GenAI SDK
- Supabase

## App Routes

- / : Landing page
- /scan : Image scanner
- /history : Scan history
- /history/:id : Scan detail
- /about : About page

## API Routes

All API routes live in the api folder and are served by Vercel runtime.

- POST /api/analyze
	- Accepts multipart form-data with field name: file
	- Runs Gemini vision label extraction
	- Normalizes labels and maps to nutrition database
	- Returns totals + detected foods + unmatched labels
	- Optionally saves result to Supabase

- GET /api/history
	- Returns latest 50 scan results from Supabase table scan_results

- GET /api/history/:id
	- Returns a single scan result by id

## Environment Variables

Create a local env file from .env.example, then add required keys.

Required:
- GEMINI_API_KEY : Google AI Studio API key

Optional (for history persistence and fetch):
- SUPABASE_URL
- SUPABASE_KEY

Compatibility aliases supported by the code:
- VITE_GEMINI_API_KEY
- VITE_SUPABASE_URL
- VITE_SUPABASE_KEY
- GEMINI_VISION_MODEL (default: gemini-3.5-flash)
- VITE_API_BASE_URL (optional fallback base URL)

## Local Development

Prerequisites:
- Node.js 18+
- npm

Install dependencies:

	npm install

Run with Vercel dev (recommended, includes API routes):

	npm run dev

Run frontend only (without Vercel function runtime):

	npm run dev:vite

Build production bundle:

	npm run build

Preview build:

	npm run preview

Run tests:

	npm run test

Lint:

	npm run lint

## Project Structure

frontend/
- api/
	- analyze.ts
	- history.ts
	- history/[id].ts
- lib/
	- labelNormalizer.ts
	- nutritionDB.ts
- src/
	- pages/public/ (landing, about, not found)
	- pages/scanner/ (scanner + detail)
	- pages/history/ (history page)
	- components/ (ui, scanner, shared, layout)
	- lib/api.ts (frontend API client)

## Data Flow Summary

1. User uploads image from scanner page.
2. Frontend sends multipart request to POST /api/analyze.
3. API calls Gemini vision model and returns food labels.
4. Labels are normalized and matched to internal nutrition database.
5. API calculates macro totals and optional Supabase persistence.
6. Frontend renders labels, detected items, totals, and notes.

## Notes

- Estimation is based on label detection and default serving portions, not precise weighing.
- If VITE_API_BASE_URL is empty, frontend uses same-origin API routes.
- For local testing of API, prefer npm run dev over npm run dev:vite.

## Deployment

This project is configured for Vercel:
- buildCommand: npm run build
- outputDirectory: dist
- framework: vite

Before deploy, ensure environment variables are set in Vercel project settings.
