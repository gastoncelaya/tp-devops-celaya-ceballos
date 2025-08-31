const express = require('express');
const app = express();
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// CRUD simple en memoria
let items = [];

app.get('/items', (_req, res) => res.json(items));

app.post('/items', (req, res) => {
  const { name } = req.body;
  const item = { id: Date.now(), name };
  items.push(item);
  res.status(201).json(item);
});

app.delete('/items/:id', (req, res) => {
  items = items.filter(i => i.id !== Number(req.params.id));
  res.sendStatus(204);
});

module.exports = app;