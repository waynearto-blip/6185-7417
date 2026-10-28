# 6185 AI Builder Agent

Comprehensive Node.js structure for an AI Builder Agent (6185 account).

## Overview
Modular architecture for an agent that plans, scaffolds, and builds projects, with a local SQLite DB for memory/history and a simple web UI.

## Project Structure
```
6185-7417/
├── src/
│   ├── agents/
│   │   └── builderAgent.js     # Core AI builder agent class
│   ├── tools/
│   │   └── fileSystem.js       # File system tools for the agent
│   ├── prompts/
│   │   └── systemPrompts.js    # System prompts for planning/building
│   ├── db/
│   │   └── database.js         # SQLite setup (builds + items tables)
│   └── config.js              # Agent configuration
├── public/                   # Web UI (items manager + future agent dashboard)
├── index.js                  # Express entry point + agent API
├── package.json
├── data/                     # Local DB (gitignored)
└── README.md
```

## Features
- AI Builder Agent with planning stubs (ready for LLM integration)
- Local SQLite for build history and items
- REST API for agent builds and items
- Simple web UI
- Modular tools and prompts

## Getting started
```bash
npm install
npm start
```
Open http://localhost:3000

### Agent API
- `POST /api/agent/build` — `{ prompt }` → create build + plan
- `GET /api/agent/builds` — list builds
- `GET /api/agent/builds/:id` — get build details

### Next steps
- Integrate real LLM (OpenAI, Anthropic, etc.) in `builderAgent.plan()`
- Expand tools (code gen, testing, git)
- Enhance UI for agent interaction
- Add more agent types under `src/agents/`

Note: `better-sqlite3` requires native build tools on first install.
