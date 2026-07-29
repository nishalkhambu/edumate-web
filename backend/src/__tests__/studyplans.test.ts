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

describe('Study Plans', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    authToken = loginRes.data.token;
  });

  it('should create a study plan', async () => {
    const { status, data } = await request('/study-plans', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Test Plan', subject: 'Math', topic: 'Algebra', deadline: '2025-12-31', progress: 0 }),
    });
    expect(status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Test Plan');
  });

  it('should get study plans', async () => {
    const { status, data } = await request('/study-plans', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should update a study plan', async () => {
    const createRes = await request('/study-plans', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Plan to Update', subject: 'Science', topic: 'Physics', deadline: '2025-12-31', progress: 0 }),
    });
    const planId = createRes.data.data.id;
    const { status, data } = await request(`/study-plans/${planId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Updated Plan', subject: 'Science', topic: 'Physics', deadline: '2025-12-31', progress: 50 }),
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Updated Plan');
  });

  it('should delete a study plan', async () => {
    const createRes = await request('/study-plans', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Plan to Delete', subject: 'History', topic: 'WWII', deadline: '2025-12-31', progress: 0 }),
    });
    const planId = createRes.data.data.id;
    const { status, data } = await request(`/study-plans/${planId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should fail create study plan with invalid data', async () => {
    const { status, data } = await request('/study-plans', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: '' }),
    });
    expect(status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should fail access study plans without token', async () => {
    const { status, data } = await request('/study-plans', {
      method: 'GET',
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });
});
