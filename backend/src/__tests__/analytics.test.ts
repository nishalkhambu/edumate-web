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

describe('Analytics', () => {
  it('should return analytics for authenticated user', async () => {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    const token = loginRes.data.token;
    const { status, data } = await request('/analytics', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should fail analytics without token', async () => {
    const { status, data } = await request('/analytics', {
      method: 'GET',
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });
});
