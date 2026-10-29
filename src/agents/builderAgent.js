const OpenAI = require('openai');
const db = require('../db/database');
const prompts = require('../prompts/systemPrompts');
const config = require('../config');

/**
 * 6185 AI Builder Agent
 * Core logic for planning and building projects with real LLM.
 */
class BuilderAgent {
  constructor() {
    this.name = config.agentName;
    this.openai = config.openaiApiKey
      ? new OpenAI({ apiKey: config.openaiApiKey })
      : null;
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

  async plan(prompt) {
    if (!this.openai) {
      return {
        plan: `Plan for: ${prompt} (no OpenAI key configured — set OPENAI_API_KEY in .env)`,
        files: [],
        nextSteps: ['Add API key', 'Retry']
      };
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: config.defaultModel,
        messages: [
          { role: 'system', content: prompts.builder },
          { role: 'user', content: `Create a detailed build plan for: ${prompt}\n\nRespond with JSON: { "plan": string, "files": [{ "path": string, "content": string }], "nextSteps": string[] }` }
        ],
        max_tokens: config.maxTokens,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const text = completion.choices[0].message.content;
      const result = JSON.parse(text);
      return {
        plan: result.plan || text,
        files: result.files || [],
        nextSteps: result.nextSteps || ['Review', 'Implement', 'Test']
      };
    } catch (err) {
      console.error('LLM error:', err.message);
      return {
        plan: `Error generating plan: ${err.message}`,
        files: [],
        nextSteps: ['Check API key and retry']
      };
    }
  }
}

module.exports = new BuilderAgent();
