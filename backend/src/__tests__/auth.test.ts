import { describe, it, expect } from "@jest/globals";

const API = process.env.PORT ? `http://localhost:${process.env.PORT}/api/v1` : 'http://localhost:5000/api/v1';

async function request(path: string, options: RequestInit = {}, cookies?: string[]) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(cookies?.length ? { Cookie: cookies.join('; ') } : {}),
    },
  });
  const data = await res.json() as any;
  const setCookieHeader = res.headers.get('set-cookie') || '';
  const setCookies = setCookieHeader ? setCookieHeader.split(', ') : [];
  return { status: res.status, data, setCookies };
}

describe('Authentication Flow', () => {
  it('should register a new user', async () => {
    const uniqueEmail = `testuser_${Date.now()}@edumate.com`;
    const { status, data } = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: uniqueEmail, password: 'Test@12345' }),
    });
    expect(status).toBe(201);
    expect(data.success).toBe(true);
  });

  it('should fail register with duplicate email', async () => {
    const uniqueEmail = `testuser_${Date.now()}@edumate.com`;
    await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: uniqueEmail, password: 'Test@12345' }),
    });
    const { status, data } = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: uniqueEmail, password: 'Test@12345' }),
    });
    expect(status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should fail register with invalid input', async () => {
    const { status, data } = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: '', email: 'invalid-email', password: 'short' }),
    });
    expect(status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should login successfully', async () => {
    const { status, data } = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
  });

  it('should fail login with invalid password', async () => {
    const { status, data } = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'WrongPassword' }),
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('should fail login with invalid email', async () => {
    const { status, data } = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'nonexistent@test.com', password: 'Test@12345' }),
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('should handle forgot password', async () => {
    const { status, data } = await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com' }),
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should handle forgot password for non-existent email', async () => {
    const { status, data } = await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'nonexistent@test.com' }),
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should refresh token successfully', async () => {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    const refreshToken = loginRes.data.refreshToken;
    const cookie = `edumate_refresh_token=${refreshToken}`;
    const { status, data } = await request('/auth/refresh', {
      method: 'POST',
    }, [cookie]);
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should logout successfully', async () => {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    const refreshToken = loginRes.data.refreshToken;
    const cookie = `edumate_refresh_token=${refreshToken}`;
    const { status, data } = await request('/auth/logout', {
      method: 'POST',
    }, [cookie]);
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should access whoami with valid token', async () => {
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

  it('should fail whoami without token', async () => {
    const { status, data } = await request('/auth/whoami', {
      method: 'GET',
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });
});
