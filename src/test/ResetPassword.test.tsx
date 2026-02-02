import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '@/pages/ResetPassword';
import { supabase } from '@/lib/supabase';

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn(),
    },
  },
  isSupabaseConfigured: vi.fn(() => true),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderResetPassword = () => {
  return render(
    <BrowserRouter>
      <ResetPassword />
    </BrowserRouter>
  );
};

describe('ResetPassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // AC1: Navigation to reset page
  it('should render the reset password page with correct title', () => {
    renderResetPassword();
    
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByText(/Enter your email to receive a password reset link/i)).toBeInTheDocument();
  });

  it('should have a back to login link', () => {
    renderResetPassword();
    
    const backLinks = screen.getAllByText('Back to Login');
    expect(backLinks.length).toBeGreaterThan(0);
    expect(backLinks[0].closest('a')).toHaveAttribute('href', '/auth');
  });

  // AC2: Request reset link
  it('should send reset email for valid email address', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
      data: {},
      error: null,
    } as any);

    renderResetPassword();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'adib@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'adib@example.com',
        expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/update-password'),
        })
      );
    });
  });

  it('should display success message after sending reset email', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
      data: {},
      error: null,
    } as any);

    renderResetPassword();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'adib@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password reset email sent!')).toBeInTheDocument();
      expect(screen.getByText(/If this email exists in our system/i)).toBeInTheDocument();
      expect(screen.getByText(/The reset link will be valid for 1 hour/i)).toBeInTheDocument();
    });
  });

  it('should show loading state while sending reset email', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.resetPasswordForEmail).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {}, error: null } as any), 100))
    );

    renderResetPassword();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'adib@example.com');
    await user.click(submitButton);

    expect(screen.getByText(/sending reset link/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  // AC6: Unregistered email (security - don't reveal)
  it('should show generic success message even for unregistered email', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
      data: {},
      error: { name: 'AuthApiError', message: 'User not found' } as any,
    } as any);

    renderResetPassword();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'nonexistent@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      // Should still show success message (security feature)
      expect(screen.getByText('Password reset email sent!')).toBeInTheDocument();
      expect(screen.getByText(/If this email exists in our system/i)).toBeInTheDocument();
    });
  });

  // Email validation
  it('should validate email format', async () => {
    const user = userEvent.setup();
    renderResetPassword();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it('should require email field', async () => {
    const user = userEvent.setup();
    renderResetPassword();

    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  // Success state navigation
  it('should show return to login button after success', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
      data: {},
      error: null,
    } as any);

    renderResetPassword();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    await user.type(emailInput, 'adib@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      const returnButton = screen.getByRole('button', { name: /return to login/i });
      expect(returnButton).toBeInTheDocument();
    });
  });

  // Supabase configuration check
  it('should handle unconfigured Supabase gracefully', async () => {
    const { isSupabaseConfigured } = await import('@/lib/supabase');
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);

    const user = userEvent.setup();
    renderResetPassword();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    await user.type(emailInput, 'adib@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
    });
  });
});
