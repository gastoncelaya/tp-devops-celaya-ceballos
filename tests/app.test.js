const request = require('supertest');
const app = require('../src/app');

describe('API básica', () => {
  it('GET /health devuelve {status:"ok"}', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('POST /items crea un item', async () => {
    const res = await request(app).post('/items').send({ name: 'foo' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});