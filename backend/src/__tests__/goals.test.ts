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

describe('Goals', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    authToken = loginRes.data.token;
  });

  it('should create a goal', async () => {
    const { status, data } = await request('/goals', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Test Goal', description: 'Test description', target: 100, unit: 'pages', type: 'weekly', deadline: '2025-12-31' }),
    });
    expect(status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Test Goal');
  });

  it('should get goals', async () => {
    const { status, data } = await request('/goals', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should update a goal', async () => {
    const createRes = await request('/goals', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Goal to Update', description: '', target: 50, unit: 'pages', type: 'daily', deadline: '2025-12-31' }),
    });
    const goalId = createRes.data.data.id;
    const { status, data } = await request(`/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Updated Goal', description: 'Updated', target: 100, unit: 'pages', type: 'weekly', deadline: '2025-12-31' }),
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Updated Goal');
  });

  it('should delete a goal', async () => {
    const createRes = await request('/goals', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Goal to Delete', description: '', target: 10, unit: 'hours', type: 'daily', deadline: '2025-12-31' }),
    });
    const goalId = createRes.data.data.id;
    const { status, data } = await request(`/goals/${goalId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should fail access goals without token', async () => {
    const { status, data } = await request('/goals', {
      method: 'GET',
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });
});
