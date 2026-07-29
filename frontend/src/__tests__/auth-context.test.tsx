import React, { useContext } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AuthContext, { AuthProvider, useAuth } from '../contexts/AuthContext';

const TestConsumer = () => {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="user-name">{auth.user?.name || 'no-user'}</span>
      <span data-testid="loading">{auth.isLoading ? 'loading' : 'ready'}</span>
    </div>
  );
};

describe('Auth Context', () => {
  it('provides initial state with no user', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });
    expect(screen.getByTestId('user-name')).toHaveTextContent('no-user');
  });
});
