const request = require('supertest'); // require funcion para importar modulos 
const app = require('../src/app');

describe('API básica', () => {
  it('GET /health devuelve {status:"ok"}', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok', version: '1.1.3' });
  });

  it('POST /items crea un item', async () => {
    const res = await request(app).post('/items').send({ name: 'foo' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('PUT /items/:id actualiza un item existente', async () => {
    // Primero creamos un item
    const createRes = await request(app).post('/items').send({ name: 'viejo' });
    const id = createRes.body.id;

    // Ahora lo actualizamos
    const updateRes = await request(app).put(`/items/${id}`).send({ name: 'nuevo' });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.name).toBe('nuevo');
  });

  it('DELETE /items/:id elimina un item existente', async () => {
    // Creamos un item
    const createRes = await request(app).post('/items').send({ name: 'para borrar' });
    const id = createRes.body.id;

    // Lo borramos
    const deleteRes = await request(app).delete(`/items/${id}`);
    expect(deleteRes.statusCode).toBe(204);

    // Verificamos que ya no está
    const listRes = await request(app).get('/items');
    expect(listRes.body.find(i => i.id === id)).toBeUndefined();
  });
});