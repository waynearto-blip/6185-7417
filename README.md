# 6185 AI Builder Agent

Comprehensive Node.js AI Builder Agent with real LLM integration (OpenAI), local SQLite memory, tools, and web UI.

## Overview
Modular agent that plans and scaffolds projects using an LLM, stores build history in SQLite, and provides a simple UI.

## Project Structure
```
6185-7417/
├── src/
│   ├── agents/
│   │   └── builderAgent.js     # Core agent with OpenAI plan()
│   ├── tools/
│   │   └── fileSystem.js       # File system tools
│   ├── prompts/
│   │   └── systemPrompts.js    # System prompts
│   ├── db/
│   │   └── database.js         # SQLite (builds + items)
│   └── config.js              # Config + dotenv
├── public/                   # Web UI (agent + notes)
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
- Real OpenAI-powered planning (`POST /api/agent/build`)
- Local SQLite for build history and notes
- Web UI for generating plans and managing items
- Modular agents / tools / prompts

## Agent API
- `POST /api/agent/build` — `{ prompt }` → plan + stored build
- `GET /api/agent/builds` — list builds
- `GET /api/agent/builds/:id` — build details

Note: `better-sqlite3` needs native build tools on first install. Without an OpenAI key the agent returns a fallback message.
