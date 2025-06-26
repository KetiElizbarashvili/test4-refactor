const request     = require('supertest');
const express     = require('express');
const path        = require('path');
const fs          = require('fs').promises;
const statsRouter = require('../routes/stats');
const { refreshStats, closeWatcher } = statsRouter;

const DATA_PATH   = path.join(__dirname, '../../../data/items.json');
const wait        = ms => new Promise(res => setTimeout(res, ms));
let originalData;

function makeApp() {
  const app = express();
  app.use('/api/stats', statsRouter);
  return app;
}

describe('/api/stats cache behavior', () => {
  beforeAll(async () => {
    originalData = await fs.readFile(DATA_PATH, 'utf-8');
    const seed = [
      { id: 1, name: 'X', category: 'A', price: 100 },
      { id: 2, name: 'Y', category: 'B', price: 300 }
    ];
    await fs.writeFile(DATA_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    await refreshStats();
  });

  afterAll(async () => {
    await fs.writeFile(DATA_PATH, originalData, 'utf-8');
    closeWatcher();
  });

  test('returns initial cached stats', async () => {
    const app = makeApp();
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 2, averagePrice: 200 });
  });

  test('updates cache after file change', async () => {
    const items = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
    items.push({ id: 3, name: 'Z', category: 'C', price: 500 });
    await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
    await refreshStats();
    const app = makeApp();
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 3, averagePrice: 300 });
  });
});
 