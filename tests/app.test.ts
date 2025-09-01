import request from 'supertest';
import app from '../src/app.js';

describe('App Integration Tests', () => {
  test('should respond to health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('service', 'File Upload Service');
  });

  test('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/unknown-route')
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Route not found');
    expect(response.body).toHaveProperty('path', '/unknown-route');
    expect(response.body).toHaveProperty('method', 'GET');
  });

  test('should handle different HTTP methods for 404', async () => {
    const response = await request(app)
      .post('/unknown-route')
      .expect(404);

    expect(response.body).toHaveProperty('method', 'POST');
  });
});
