import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TasksPage from '../../app/dashboard/tasks/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
}));

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1', name: 'Test', email: 'test@test.com', role: 'student', status: 'active' }, isLoading: false }),
}));

jest.mock('../../src/actions/study.actions', () => ({
  listTasksAction: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  createTaskAction: jest.fn(() => Promise.resolve({ success: true, data: { id: '1', title: 'New Task', description: '', subject: '', dueDate: '', priority: 'medium', status: 'pending' } })),
}));

describe('Tasks Page', () => {
  it('renders tasks page with empty state', async () => {
    render(<TasksPage />);
    expect(await screen.findByText('No tasks yet. Add your first task above.')).toBeDefined();
  });

  it('opens task form when clicking Add Task', async () => {
    render(<TasksPage />);
    await waitFor(() => {
      expect(screen.getByText('Add Task')).toBeDefined();
    });
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Save Task')).toBeDefined();
  });
});
