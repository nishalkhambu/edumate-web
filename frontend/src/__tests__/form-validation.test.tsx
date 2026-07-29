import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../app/login/page';
import RegisterPage from '../../app/register/page';

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

describe('Form Validation', () => {
  it('login form shows error on empty submit', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeDefined();
    });
  });

  it('login form accepts valid email', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@edumate.com' } });
    expect(emailInput).toHaveValue('test@edumate.com');
  });

  it('register form shows password mismatch error', async () => {
    render(<RegisterPage />);
    const passwordInputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'Test@123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'Test@456' } });
    fireEvent.click(screen.getByText('Register'));
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeDefined();
    });
  });
});
