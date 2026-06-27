# StoryFox

StoryFox is an AI-powered voice storytelling platform for children aged 4-10. Children speak naturally, and the AI performs as narrator, sidekick, and helper during a short interactive adventure.

## Apps

- `apps/web`: Next.js 15 web experience with LiveKit voice UI.
- `apps/agent`: LiveKit agent process that hosts the realtime story character.

## Packages

- `packages/story-engine`: deterministic story state, scenes, questions, whistle events, stars, and summaries.
- `packages/audio`: sound tag parsing and browser audio orchestration.
- `packages/types`: shared TypeScript contracts.
- `packages/ui`: shared UI primitives.
- `packages/config`: environment helpers.
- `packages/utils`: reusable helpers.

## Local Setup

1. Copy `.env.example` to `.env.local` and fill service keys.
2. Run `npm install`.
3. Run `npm run dev` for the web app.
4. Run `npm run dev:agent` for the LiveKit agent.

The web app can render without service keys, but realtime voice requires LiveKit and OpenAI credentials.
