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

describe('Admin', () => {
  it('should allow admin access to user listing', async () => {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    const token = loginRes.data.token;
    const { status, data } = await request('/admin/users', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should fail admin access without token', async () => {
    const { status, data } = await request('/admin/users', {
      method: 'GET',
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('should fail admin access with non-admin token', async () => {
    const uniqueEmail = `testuser_${Date.now()}@edumate.com`;
    await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: uniqueEmail, password: 'Test@12345' }),
    });
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: uniqueEmail, password: 'Test@12345' }),
    });
    const token = loginRes.data.token;
    const { status, data } = await request('/admin/users', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    expect(status).toBe(403);
    expect(data.success).toBe(false);
  });
});
