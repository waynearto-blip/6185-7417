const db = require('../db/database');
const prompts = require('../prompts/systemPrompts');
const config = require('../config');

/**
 * 6185 AI Builder Agent
 * Core logic for planning and building projects.
 */
class BuilderAgent {
  constructor() {
    this.name = config.agentName;
  }

  async createBuild(prompt) {
    const stmt = db.prepare('INSERT INTO builds (prompt, status) VALUES (?, ?)');
    const info = stmt.run(prompt, 'planning');
    return { id: info.lastInsertRowid, prompt };
  }

  async getBuild(id) {
    return db.prepare('SELECT * FROM builds WHERE id = ?').get(id);
  }

  async listBuilds() {
    return db.prepare('SELECT id, prompt, status, created_at FROM builds ORDER BY created_at DESC').all();
  }

  // Placeholder for LLM call (integrate OpenAI/Anthropic etc. via env)
  async plan(prompt) {
    // TODO: Call LLM with prompts.builder
    return {
      plan: `Plan for: ${prompt}`,
      files: [],
      nextSteps: ['Review plan', 'Generate code', 'Test']
    };
  }
}

module.exports = new BuilderAgent();
