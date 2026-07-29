import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudyPlannerPage from '../../app/dashboard/study-planner/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
}));

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1', name: 'Test', email: 'test@test.com', role: 'student', status: 'active' }, isLoading: false }),
}));

jest.mock('../../src/actions/study.actions', () => ({
  listStudyPlansAction: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  createStudyPlanAction: jest.fn(() => Promise.resolve({ success: true, data: { id: '1', title: 'New Plan', subject: 'Math', topic: 'Algebra', deadline: '2025-01-01', progress: 0 } })),
}));

describe('Study Planner Page', () => {
  it('renders study planner with empty state', async () => {
    render(<StudyPlannerPage />);
    await waitFor(() => {
      expect(screen.getByText('Study Planner')).toBeDefined();
    });
    await waitFor(() => {
      expect(screen.getByText(/No study plans yet/)).toBeDefined();
    });
  });

  it('opens create plan modal when clicking Create Plan', async () => {
    render(<StudyPlannerPage />);
    await waitFor(() => {
      expect(screen.getByText('Create Plan')).toBeDefined();
    });
    fireEvent.click(screen.getByText('Create Plan'));
    expect(screen.getByText('Create Study Plan')).toBeDefined();
  });
});
