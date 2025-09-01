import request from 'supertest';
import express from 'express';
import uploadRouter from '../src/routes/upload.js';
import * as fileService from '../src/services/fileService.js';

// Mock the fileService
jest.mock('../src/services/fileService.js', () => ({
  saveFileMeta: jest.fn().mockResolvedValue({
    filename: 'test.pdf',
    mimetype: 'application/pdf',
    size: 17,
    path: 'uploads/test.pdf',
    uploadDate: new Date()
  }),
  getFileMeta: jest.fn(),
  deleteFileMeta: jest.fn()
}));

const app = express();
app.use('/api', uploadRouter);

describe('File Upload API', () => {
  test('should upload a file successfully', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('test file content'), 'test.pdf')
      .expect(201);

    expect(response.body).toHaveProperty('filename');
    expect(response.body).toHaveProperty('mimetype');
    expect(response.body).toHaveProperty('size');
    expect(response.body).toHaveProperty('path');
  });

  test('should reject files larger than 5MB', async () => {
    // יצירת buffer של 6MB
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'a');
    
    const response = await request(app)
      .post('/api/upload')
      .attach('file', largeBuffer, 'large.txt')
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  test('should reject unsupported file types', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('test content'), 'test.exe')
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  test('should return error when no file is uploaded', async () => {
    const response = await request(app)
      .post('/api/upload')
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('File type is not allowed or no file uploaded');
  });
});