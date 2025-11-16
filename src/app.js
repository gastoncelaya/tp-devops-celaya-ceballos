const express = require('express'); // require importa la libreria express para poder levantar un servidor
const app = express(); // app es el servidor express, es nuestro objeto y tiene metodos predefinidos
app.use(express.json()); // express.json() permite que Express lea datos en formato JSON enviados en el cuerpo de una solicitud POST o PUT.

// Health check
app.get('/health', (_req, res) => {
  // LOG AGREGADO
  console.info('Health check solicitado!'); 
  res.json({ status: 'ok', version: '1.1.3' }); //metodo que ejecuta una solicitud get y devuelve ok
});

// CRUD simple en memoria
let items = []; // creamos un array para cargarlo con las solicitudes

// get
app.get('/items', (_req, res) => {
  // LOG AGREGADO
  console.info(`GET /items - Devolviendo ${items.length} items`);
  res.json(items); // solicitud get
});

// create
app.post('/items', (req, res) => {
  const { name } = req.body;
  const item = { id: Date.now(), name };
  items.push(item);
  
  // LOG AGREGADO
  console.info('POST /items - Nuevo item creado:', item);
  res.status(201).json(item);
}); // solicitud post

// update
app.put('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    // LOG AGREGADO
    console.warn(`PUT /items - Item no encontrado: ${id}`);
    return res.status(404).json({ error: 'Item not found' });
  }

  items[index].name = name;
  
  // LOG AGREGADO
  console.info('PUT /items - Item actualizado:', items[index]);
  res.json(items[index]);
}); // solicitud put

// delete
app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  // LOG AGREGADO
  console.info(`DELETE /items - Eliminando item con id: ${id}`);
  items = items.filter(i => i.id !== id);
  res.sendStatus(204);
}); 

module.exports = app; // permite exportar el objeto app a otros archivos