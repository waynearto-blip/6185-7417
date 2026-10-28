const fs = require('fs').promises;
const path = require('path');

/**
 * File system tools for the AI Builder Agent
 */
module.exports = {
  async writeFile(relPath, content) {
    const full = path.join(process.cwd(), relPath);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, content, 'utf8');
    return { success: true, path: relPath };
  },

  async readFile(relPath) {
    const full = path.join(process.cwd(), relPath);
    return await fs.readFile(full, 'utf8');
  },

  async listDir(relPath = '.') {
    const full = path.join(process.cwd(), relPath);
    return await fs.readdir(full);
  }
};
