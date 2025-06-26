const request     = require('supertest');
const express     = require('express');
const path        = require('path');
const fs          = require('fs').promises;
const itemsRouter = require('../routes/items');

const DATA_PATH   = path.join(__dirname, '../../../data/items.json');
let original;

beforeAll(async () => {
  original = await fs.readFile(DATA_PATH, 'utf-8');
  await fs.writeFile(
    DATA_PATH,
    JSON.stringify([
      { id: 1, name: 'A', category: 'X', price: 10 },
      { id: 2, name: 'B', category: 'Y', price: 20 }
    ], null, 2),
    'utf-8'
  );
});

afterAll(async () => {
  await fs.writeFile(DATA_PATH, original, 'utf-8');
});

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/items', itemsRouter);
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
  });
  return app;
}

describe('Items API', () => {
  let app;
  beforeAll(() => { app = makeApp(); });

  test('GET list (limit=1)', async () => {
    const res = await request(app).get('/api/items?limit=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('GET by ID success', async () => {
    const res = await request(app).get('/api/items/2');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('B');
  });

  test('GET by ID 404', async () => {
    const res = await request(app).get('/api/items/99');
    expect(res.status).toBe(404);
  });

  test('POST valid', async () => {
    const payload = { name: 'C', category: 'Z', price: 30 };
    const res = await request(app).post('/api/items').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test('POST invalid', async () => {
    const res = await request(app).post('/api/items').send({ name: '', price: -5 });
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
 