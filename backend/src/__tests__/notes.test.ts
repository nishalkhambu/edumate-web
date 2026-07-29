import { describe, it, expect } from "@jest/globals";

const API = process.env.PORT ? `http://localhost:${process.env.PORT}/api/v1` : 'http://localhost:5000/api/v1';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json() as any;
  return { status: res.status, data };
}

describe('Notes', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    authToken = loginRes.data.token;
  });

  it('should create a note', async () => {
    const { status, data } = await request('/notes', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Test Note', content: 'Test content', tag: 'Math' }),
    });
    expect(status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Test Note');
  });

  it('should get notes', async () => {
    const { status, data } = await request('/notes', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should update a note', async () => {
    const createRes = await request('/notes', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Note to Update', content: 'Original', tag: 'Science' }),
    });
    const noteId = createRes.data.data.id;
    const { status, data } = await request(`/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Updated Note', content: 'Updated', tag: 'Science' }),
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Updated Note');
  });

  it('should delete a note', async () => {
    const createRes = await request('/notes', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Note to Delete', content: '', tag: 'History' }),
    });
    const noteId = createRes.data.data.id;
    const { status, data } = await request(`/notes/${noteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should fail access notes without token', async () => {
    const { status, data } = await request('/notes', {
      method: 'GET',
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });
});
