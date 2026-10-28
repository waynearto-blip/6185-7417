# 6185

Node.js project for the 6185 account with a simple web UI and local SQLite database.

## Features
- Express web server
- Simple UI to manage items (notes/records)
- Local SQLite database (`data/6185.db`)
- REST API for items

## Getting started

```bash
# Install dependencies
npm install

# Run the project
npm start

# Or in watch mode (Node 18+)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Structure

- `index.js` — Express server + API + DB init
- `public/` — Static UI (HTML/CSS/JS)
- `data/6185.db` — Local SQLite database (created on first run, gitignored)
- `package.json` — Dependencies: express, better-sqlite3

## API

- `GET /api/items` — List all items
- `POST /api/items` — Create item `{ title, content }`
- `DELETE /api/items/:id` — Delete item

Note: `better-sqlite3` requires a C++ compiler on first install (build tools on Windows, build-essential on Linux, Xcode tools on macOS).
