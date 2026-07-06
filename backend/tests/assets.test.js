jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

describe('Assets API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/assets returns a list of assets', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, asset_code: 'PC-001', brand: 'Dell', model: 'OptiPlex 7090' }],
    });

    const res = await request(app).get('/api/assets');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].asset_code).toBe('PC-001');
  });

  it('GET /api/assets/:id returns 404 when asset not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/assets/999');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/assets creates a new asset', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 3, asset_code: 'PC-003', brand: 'Lenovo', model: 'M720', room: 'Lab A103', status: 'active' }],
    });

    const res = await request(app).post('/api/assets').send({
      asset_code: 'PC-003',
      brand: 'Lenovo',
      model: 'M720',
      room: 'Lab A103',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.asset_code).toBe('PC-003');
  });

  it('POST /api/assets returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/assets').send({ brand: 'Lenovo' });
    expect(res.statusCode).toBe(400);
  });

  it('DELETE /api/assets/:id removes an asset', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const res = await request(app).delete('/api/assets/1');
    expect(res.statusCode).toBe(204);
  });
});
