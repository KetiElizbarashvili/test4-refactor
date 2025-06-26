const express  = require('express');
const chokidar = require('chokidar');
const path     = require('path');
const { readData } = require('../utils/dataAccess');

const router    = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cache = { total: 0, averagePrice: 0 };

async function refreshStats() {
  try {
    const items = await readData(DATA_PATH);
    const total = items.length;
    const sum   = items.reduce((a, i) => a + i.price, 0);
    cache = { total, averagePrice: total ? sum / total : 0 };
  } catch {
  }
}

refreshStats();

router.closeWatcher = () => {};

if (process.env.NODE_ENV !== 'test') {
  const watcher = chokidar.watch(DATA_PATH).on('change', refreshStats);
  router.closeWatcher = () => watcher.close();
}

router.refreshStats = refreshStats;

router.get('/', (req, res) => {
  res.json(cache);
});

module.exports = router;
 