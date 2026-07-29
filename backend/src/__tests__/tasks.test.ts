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

describe('Tasks', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@edumate.com', password: 'Admin@12345' }),
    });
    authToken = loginRes.data.token;
  });

  it('should create a task', async () => {
    const { status, data } = await request('/tasks', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Test Task', description: 'Test description', subject: 'Math', dueDate: '2025-12-31', priority: 'medium', status: 'pending' }),
    });
    expect(status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Test Task');
  });

  it('should get tasks', async () => {
    const { status, data } = await request('/tasks', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should update a task', async () => {
    const createRes = await request('/tasks', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Task to Update', description: '', subject: '', dueDate: '', priority: 'low', status: 'pending' }),
    });
    const taskId = createRes.data.data.id;
    const { status, data } = await request(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Updated Task', description: '', subject: '', dueDate: '', priority: 'high', status: 'in_progress' }),
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    const createRes = await request('/tasks', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Task to Delete', description: '', subject: '', dueDate: '', priority: 'low', status: 'pending' }),
    });
    const taskId = createRes.data.data.id;
    const { status, data } = await request(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should fail access tasks without token', async () => {
    const { status, data } = await request('/tasks', {
      method: 'GET',
    });
    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });
});
