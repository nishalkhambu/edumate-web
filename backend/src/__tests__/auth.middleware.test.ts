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

describe('Auth Middleware', () => {
  it('should reject request with missing token', async () => {
    const { status, data } = await request('/auth/whoami', {
      method: 'GET',
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toContain('Unauthorized');
  });

  it('should reject request with invalid token', async () => {
    const { status, data } = await request('/auth/whoami', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer invalidtoken123' },
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('should authorize request with valid token', async () => {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    const token = loginRes.data.token;
    const { status, data } = await request('/auth/whoami', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
  });

  it('should reject expired or malformed token', async () => {
    const { status, data } = await request('/auth/whoami', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid' },
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });
});
