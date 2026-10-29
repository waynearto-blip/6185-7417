# 6185 AI Builder Agent

Comprehensive Node.js AI Builder Agent with real LLM integration (OpenAI), local SQLite memory, tools, web UI, and an extensive **contract-to-presentation** process with deep comprehension.

## Overview
Modular agent that:
- Plans and scaffolds projects
- Performs deep comprehension of contracts / SOWs / specifications
- Generates extensive professional presentations from those contracts
- Stores history in SQLite

## Project Structure
```
6185-7417/
├── src/
│   ├── agents/
│   │   └── builderAgent.js     # Core agent: plan() + contractToPresentation()
│   ├── tools/
│   │   └── fileSystem.js       # File system tools
│   ├── prompts/
│   │   └── systemPrompts.js    # Prompts including contract comprehension & presentation
│   ├── db/
│   │   └── database.js         # SQLite (builds + items)
│   └── config.js              # Config + dotenv
├── public/                   # Web UI (contract → presentation + builder + notes)
├── index.js                  # Express + agent API
├── package.json
├── .env.example              # Copy to .env
├── data/                     # Local DB (gitignored)
└── README.md
```

## Setup

1. Copy `.env.example` to `.env` and add your OpenAI key:
   ```
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4o-mini
   ```

2. Install and run:
   ```bash
   npm install
   npm start
   ```

3. Open http://localhost:3000

## Features
- **Extensive Contract-to-Presentation**: Paste a contract → deep multi-step comprehension → full professional slide deck (parties, obligations, timelines, risks, recommendations, speaker notes)
- Real OpenAI-powered project planning
- Local SQLite for build history and notes
- Web UI for all workflows
- Modular agents / tools / prompts

## Agent API
- `POST /api/agent/contract-to-presentation` — `{ contractText, title? }` → comprehension + full presentation
- `POST /api/agent/build` — `{ prompt }` → plan + stored build
- `GET /api/agent/builds` — list builds
- `GET /api/agent/builds/:id` — build details

Note: `better-sqlite3` needs native build tools on first install. Contract-to-presentation makes two LLM calls and can take 20–40 seconds. Without an OpenAI key the agent returns a fallback message.
