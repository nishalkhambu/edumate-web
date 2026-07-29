import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../app/login/page';

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ login: jest.fn(), isLoading: false }),
}));

describe('Login Page', () => {
  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome Back')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter your email')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter your password')).toBeDefined();
  });

  it('shows validation errors on empty submit', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeDefined();
    });
  });

  it('accepts valid email input', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@edumate.com' } });
    expect(emailInput).toHaveValue('test@edumate.com');
  });
});
