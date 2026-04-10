# MindPause

A Next.js mental wellness assistant for working adults, built with an AI chat backend.

## Features

- Daily affirmation and mood check-in
- Breathing and grounding exercises
- Journal and mental wellness guidance
- Chat assistant powered by OpenAI or Anthropic

## Local development

1. Copy `.env.example` to `.env.local`
2. Add your API key:
   - `OPENAI_API_KEY=sk-...`
   - or `ANTHROPIC_API_KEY=sk-ant-...`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run locally:
   ```bash
   npm run dev
   ```
5. Open: `http://localhost:3000`

## Deploy to Vercel

1. Create a GitHub repo and push this project.
2. Sign in to [Vercel](https://vercel.com) with GitHub.
3. Import the repository.
4. Set the environment variable in Vercel:
   - `OPENAI_API_KEY` or
   - `ANTHROPIC_API_KEY` / `FREE_API_KEY`
5. Deploy.

## Notes

- Do not commit `.env.local` to GitHub.
- The app is configured to use OpenAI first, with Anthropic as a fallback.
