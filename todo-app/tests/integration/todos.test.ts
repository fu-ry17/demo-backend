import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server';

describe('Todos API Integration', () => {
  it('should create a new todo', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ text: 'Test todo' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.text).toBe('Test todo');
    expect(response.body.completed).toBe(false);
  });

  it('should return 400 when creating todo without text', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({});

    expect(response.status).toBe(400);
  });

  it('should get all todos', async () => {
    await request(app)
      .post('/api/todos')
      .send({ text: 'Todo 1' });

    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update a todo', async () => {
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ text: 'Test todo' });

    const updateResponse = await request(app)
      .put(`/api/todos/${createResponse.body.id}`)
      .send({ completed: true });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.completed).toBe(true);
  });

  it('should delete a todo', async () => {
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ text: 'Test todo' });

    const deleteResponse = await request(app)
      .delete(`/api/todos/${createResponse.body.id}`);

    expect(deleteResponse.status).toBe(204);
  });
}); 