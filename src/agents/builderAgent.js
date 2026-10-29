const OpenAI = require('openai');
const db = require('../db/database');
const prompts = require('../prompts/systemPrompts');
const config = require('../config');

/**
 * 6185 AI Builder Agent
 * Enhanced with extensive contract-to-presentation process and deep comprehension.
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

  /**
   * Extensive contract-to-presentation process with deep comprehension.
   * 1. Comprehend the contract deeply
   * 2. Generate a full professional presentation structure and content
   */
  async contractToPresentation(contractText, title = 'Contract Review Presentation') {
    if (!this.openai) {
      return {
        error: 'No OpenAI key configured',
        comprehension: null,
        presentation: null
      };
    }

    try {
      // Step 1: Deep comprehension
      const compCompletion = await this.openai.chat.completions.create({
        model: config.defaultModel,
        messages: [
          { role: 'system', content: prompts.contractComprehension },
          { role: 'user', content: `Analyze this contract/specification thoroughly:\n\n${contractText.slice(0, 12000)}` }
        ],
        max_tokens: 3000,
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const comprehension = JSON.parse(compCompletion.choices[0].message.content);

      // Step 2: Generate extensive presentation
      const presCompletion = await this.openai.chat.completions.create({
        model: config.defaultModel,
        messages: [
          { role: 'system', content: prompts.presentationGenerator },
          { role: 'user', content: `Based on this comprehension:\n${JSON.stringify(comprehension, null, 2)}\n\nCreate a comprehensive presentation titled "${title}". Include 8-15 slides covering all key aspects professionally.` }
        ],
        max_tokens: 4000,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const presentation = JSON.parse(presCompletion.choices[0].message.content);

      // Store in DB
      const stmt = db.prepare('INSERT INTO builds (prompt, plan, output, status) VALUES (?, ?, ?, ?)');
      const info = stmt.run(
        `Contract to Presentation: ${title}`,
        JSON.stringify(comprehension),
        JSON.stringify(presentation),
        'completed'
      );

      return {
        buildId: info.lastInsertRowid,
        comprehension,
        presentation,
        title
      };
    } catch (err) {
      console.error('Contract-to-presentation error:', err.message);
      return {
        error: err.message,
        comprehension: null,
        presentation: null
      };
    }
  }
}

module.exports = new BuilderAgent();
