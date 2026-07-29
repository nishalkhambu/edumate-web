import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../../app/register/page';

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ register: jest.fn(), isLoading: false }),
}));

describe('Register Page', () => {
  it('renders registration form', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Create Account')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter your full name')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter your email')).toBeDefined();
  });

  it('validates password match', async () => {
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
