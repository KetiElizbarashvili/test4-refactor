const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');
const { readData, writeData } = require('../utils/dataAccess');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

const validators = [
  body('name').isString().notEmpty(),
  body('category').isString().notEmpty(),
  body('price').isFloat({ gt: 0 }),
];

router.get('/', async (req, res, next) => {
  try {
    let items = await readData(DATA_PATH);
    if (req.query.q) {
      const q = req.query.q.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q));
    }
    if (req.query.limit) {
      items = items.slice(0, +req.query.limit);
    }
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const items = await readData(DATA_PATH);
    const item = items.find(i => i.id === +req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', validators, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const items = await readData(DATA_PATH);
    const newItem = { id: Date.now(), ...req.body, price: +req.body.price };
    items.push(newItem);
    await writeData(DATA_PATH, items);
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
 