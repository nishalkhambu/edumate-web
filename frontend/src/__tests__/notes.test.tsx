import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotesPage from '../../app/dashboard/notes/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
}));

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1', name: 'Test', email: 'test@test.com', role: 'student', status: 'active' }, isLoading: false }),
}));

jest.mock('../../src/actions/study.actions', () => ({
  listNotesAction: jest.fn(() => Promise.resolve({ success: true, data: [] })),
}));

describe('Notes Page', () => {
  it('renders notes page with empty add-note card', async () => {
    render(<NotesPage />);
    await waitFor(() => {
      expect(screen.getByText('New note')).toBeDefined();
    });
  });

  it('opens create note form when clicking New Note button', async () => {
    render(<NotesPage />);
    await waitFor(() => {
      expect(screen.getByText('New Note')).toBeDefined();
    });
    fireEvent.click(screen.getByText('New Note'));
    expect(screen.getByText('Create Note')).toBeDefined();
  });
});
