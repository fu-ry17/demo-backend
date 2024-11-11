import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server';

describe('Posts API Integration', () => {
  const testPost = {
    title: 'Test Post',
    content: 'Test Content',
    author: 'Test Author',
    tags: ['test', 'integration']
  };

  it('should create a new post', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send(testPost);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.author).toBe(testPost.author);
    expect(response.body.tags).toEqual(testPost.tags);
  });

  it('should return 400 when creating post without required fields', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({ title: 'Only Title' });

    expect(response.status).toBe(400);
  });

  it('should get all posts', async () => {
    await request(app)
      .post('/api/posts')
      .send(testPost);

    const response = await request(app).get('/api/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get posts by tag', async () => {
    await request(app)
      .post('/api/posts')
      .send(testPost);

    const response = await request(app)
      .get('/api/posts')
      .query({ tag: 'test' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].tags).toContain('test');
  });

  it('should update a post', async () => {
    const createResponse = await request(app)
      .post('/api/posts')
      .send(testPost);

    const updateResponse = await request(app)
      .put(`/api/posts/${createResponse.body.id}`)
      .send({ title: 'Updated Title' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('Updated Title');
  });

  it('should delete a post', async () => {
    const createResponse = await request(app)
      .post('/api/posts')
      .send(testPost);

    const deleteResponse = await request(app)
      .delete(`/api/posts/${createResponse.body.id}`);

    expect(deleteResponse.status).toBe(204);
  });
}); 