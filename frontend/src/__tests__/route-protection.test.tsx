import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

import LoginPage from '../../app/login/page';
import RegisterPage from '../../app/register/page';

describe('Auth Pages - Route Protection', () => {
  it('login page renders for unauthenticated user', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome Back')).toBeDefined();
  });

  it('register page renders for unauthenticated user', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Create Account')).toBeDefined();
  });
});
