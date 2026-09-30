import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthScreen } from '../../components/AuthScreen';
import { ThemeProvider } from '../../contexts/ThemeContext';
import '../../i18n/config';

const MockAuthScreen = ({ onLogin }: { onLogin: jest.Mock }) => (
  <ThemeProvider>
    <AuthScreen onLogin={onLogin} />
  </ThemeProvider>
);

describe('AuthScreen', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it('renders login form by default', () => {
    render(<MockAuthScreen onLogin={mockOnLogin} />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('toggles between login and signup', () => {
    render(<MockAuthScreen onLogin={mockOnLogin} />);
    
    const toggleButton = screen.getByText('Sign Up');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<MockAuthScreen onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Sign In');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
  });

  it('shows forgot password modal', () => {
    render(<MockAuthScreen onLogin={mockOnLogin} />);
    
    const forgotPasswordLink = screen.getByText('Forgot Password?');
    fireEvent.click(forgotPasswordLink);
    
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  it('handles demo login', async () => {
    render(<MockAuthScreen onLogin={mockOnLogin} />);
    
    const demoButton = screen.getByText('Use Demo Account');
    fireEvent.click(demoButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        id: expect.stringContaining('demo-user-'),
        name: 'Demo User',
        email: 'demo@savingspilot.com'
      });
    });
  });
});