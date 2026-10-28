/**
 * 6185 AI Builder Agent Configuration
 */
module.exports = {
  agentName: '6185 Builder',
  version: '1.0.0',
  dbPath: require('path').join(__dirname, '..', 'data', '6185.db'),
  maxTokens: 4096,
  defaultModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  // Add API keys via .env
};
