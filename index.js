const express = require('express');
const path = require('path');
const db = require('./src/db/database');
const agent = require('./src/agents/builderAgent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Existing items API (kept for compatibility)
app.get('/api/items', (req, res) => {
  const items = db.prepare('SELECT * FROM items ORDER BY created_at DESC').all();
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const stmt = db.prepare('INSERT INTO items (title, content) VALUES (?, ?)');
  const info = stmt.run(title, content || '');
  res.json({ id: info.lastInsertRowid, title, content });
});

app.delete('/api/items/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM items WHERE id = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

// AI Builder Agent API
app.post('/api/agent/build', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });
  const build = await agent.createBuild(prompt);
  const plan = await agent.plan(prompt);
  // Update build with plan (simplified)
  db.prepare('UPDATE builds SET plan = ?, status = ? WHERE id = ?').run(JSON.stringify(plan), 'planned', build.id);
  res.json({ buildId: build.id, plan });
});

app.get('/api/agent/builds', async (req, res) => {
  res.json(await agent.listBuilds());
});

app.get('/api/agent/builds/:id', async (req, res) => {
  const build = await agent.getBuild(req.params.id);
  if (!build) return res.status(404).json({ error: 'Not found' });
  res.json(build);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`6185 AI Builder Agent running at http://localhost:${PORT}`);
  console.log(`Local DB ready`);
});
