import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GoalsPage from '../../app/dashboard/goals/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
}));

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1', name: 'Test', email: 'test@test.com', role: 'student', status: 'active' }, isLoading: false }),
}));

jest.mock('../../src/actions/study.actions', () => ({
  listGoalsAction: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  createGoalAction: jest.fn(() => Promise.resolve({ success: true, data: { id: '1', title: 'New Goal', description: '', target: 100, unit: 'pages', type: 'weekly', deadline: '2025-01-01', current: 0 } })),
}));

describe('Goals Page', () => {
  it('renders goals page with empty state', async () => {
    render(<GoalsPage />);
    await waitFor(() => {
      expect(screen.getByText('Goals')).toBeDefined();
    });
    await waitFor(() => {
      expect(screen.getByText(/No goals yet/)).toBeDefined();
    });
  });

  it('opens goal creation form when clicking Add Goal', async () => {
    render(<GoalsPage />);
    await waitFor(() => {
      expect(screen.getByText('Add Goal')).toBeDefined();
    });
    fireEvent.click(screen.getByText('Add Goal'));
    expect(screen.getByText('Save Goal')).toBeDefined();
  });
});
