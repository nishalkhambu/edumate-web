import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../../app/dashboard/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
}));

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1', name: 'Test', email: 'test@test.com', role: 'student', status: 'active' }, isLoading: false }),
}));

jest.mock('../../src/components/dashboard/WelcomeSection', () => ({
  WelcomeSection: () => <div data-testid="welcome-section">Welcome</div>,
}));

jest.mock('../../src/components/dashboard/AgendaTimeline', () => ({
  AgendaTimeline: () => <div data-testid="agenda-timeline">Agenda</div>,
}));

jest.mock('../../src/components/dashboard/FocusRings', () => ({
  FocusRings: () => <div data-testid="focus-rings">Focus</div>,
}));

jest.mock('../../src/components/dashboard/ProgressAnalytics', () => ({
  ProgressAnalytics: () => <div data-testid="progress-analytics">Progress</div>,
}));

jest.mock('../../src/components/dashboard/ExamsGrid', () => ({
  ExamsGrid: () => <div data-testid="exams-grid">Exams</div>,
}));

jest.mock('../../src/components/dashboard/NotesGrid', () => ({
  NotesGrid: () => <div data-testid="notes-grid">Notes</div>,
}));

jest.mock('../../src/components/dashboard/SmartInsights', () => ({
  SmartInsights: () => <div data-testid="smart-insights">Insights</div>,
}));

jest.mock('../../src/components/dashboard/QuickActions', () => ({
  QuickActions: () => <div data-testid="quick-actions">Quick Actions</div>,
}));

describe('Dashboard Page', () => {
  it('renders dashboard sections', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByTestId('welcome-section')).toBeDefined();
    });
    expect(screen.getByText('Your Agenda')).toBeDefined();
    expect(screen.getByText('Focus & Productivity')).toBeDefined();
    expect(screen.getByText('Progress Overview')).toBeDefined();
    expect(screen.getByText('Upcoming Exams')).toBeDefined();
    expect(screen.getByText('Recent Notes')).toBeDefined();
    expect(screen.getByText('Smart Insights')).toBeDefined();
  });
});
