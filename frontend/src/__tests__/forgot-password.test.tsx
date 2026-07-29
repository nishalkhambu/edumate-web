import React from 'react';
import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from '../../app/forgot-password/page';

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

describe('Forgot Password Page', () => {
  it('renders forgot password form', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText('Forgot Password')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter your email')).toBeDefined();
    expect(screen.getByText('Send Reset Link')).toBeDefined();
  });

  it('allows email input', async () => {
    render(<ForgotPasswordPage />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    emailInput.focus();
    expect(emailInput).toBeDefined();
  });
});
