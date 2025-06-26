const fs = require('fs').promises;

// Read + parse JSON file
async function readData(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

// Serialize + write JSON file
async function writeData(filePath, data) {
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, json, 'utf-8');
}

module.exports = { readData, writeData };
 