const express = require('express'); // require importa la libreria express para poder levantar un servidor
const app = express(); // app es el servidor express, es nuestro objeto y tiene metodos predefinidos
app.use(express.json()); // express.json() permite que Express lea datos en formato JSON enviados en el cuerpo de una solicitud POST o PUT.

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', version: '1.1.0' })); //metodo que ejectua una solicitud get y devuelve ok

// CRUD simple en memoria
let items = []; // creamos un array para cargarlo con las solictudes

app.get('/items', (_req, res) => res.json(items)); // solicitud get

app.post('/items', (req, res) => {
  const { name } = req.body;
  const item = { id: Date.now(), name };
  items.push(item);
  res.status(201).json(item);
}); // solicitud post

app.delete('/items/:id', (req, res) => {
  items = items.filter(i => i.id !== Number(req.params.id));
  res.sendStatus(204);
}); // delete 

module.exports = app; // permite exportar el objeto app a otros archivos