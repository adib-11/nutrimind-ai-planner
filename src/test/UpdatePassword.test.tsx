import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import UpdatePassword from '@/pages/UpdatePassword';
import { supabase } from '@/lib/supabase';

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      updateUser: vi.fn(),
      getSession: vi.fn(),
    },
  },
  isSupabaseConfigured: vi.fn(() => true),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderUpdatePassword = (initialRoute = '/auth/update-password') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <UpdatePassword />
    </MemoryRouter>
  );
};

describe('UpdatePassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { access_token: 'valid-token' } },
      error: null,
    } as any);
  });

  // AC3: Reset link validation - valid link
  it('should render the update password form for valid reset link', () => {
    renderUpdatePassword();
    
    expect(screen.getByText('Set New Password')).toBeInTheDocument();
    expect(screen.getByText(/Enter your new password below/i)).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
  });

  // AC4: Set new password with valid data
  it('should successfully update password with valid input', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    } as any);

    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    // AC4: Valid password meeting complexity requirements
    const validPassword = 'NewSecurePass123!';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);

    // Wait for password strength indicator to show all requirements met
    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: validPassword,
      });
    });
  });

  it('should redirect to login after successful password update', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    } as any);

    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];

    const validPassword = 'NewSecurePass123!';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth');
    }, { timeout: 2000 });
  });

  // Password complexity validation
  it('should enforce password complexity requirements', async () => {
    const user = userEvent.setup();
    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];

    await user.type(passwordInput, 'weak');

    await waitFor(() => {
      // Should show password requirements not met
      const requirements = screen.getByText(/at least 8 characters/i);
      expect(requirements).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /reset password/i });
    expect(submitButton).toBeDisabled(); // Button disabled until password is valid
  });

  it('should show password strength indicator', async () => {
    const user = userEvent.setup();
    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    await user.type(passwordInput, 'Testing123!');

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
      expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument();
      expect(screen.getByText(/one number/i)).toBeInTheDocument();
      expect(screen.getByText(/one special character/i)).toBeInTheDocument();
    });
  });

  it('should validate password confirmation matches', async () => {
    const user = userEvent.setup();
    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await user.type(passwordInput, 'SecurePass123!');
    await user.type(confirmPasswordInput, 'DifferentPass123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  // AC5: Expired link handling
  it('should display error message for expired reset link', async () => {
    renderUpdatePassword('/auth/update-password?error=expired_token&error_description=Token+expired');

    await waitFor(() => {
      expect(screen.getByText('Reset Link Expired')).toBeInTheDocument();
      expect(screen.getByText(/Your password reset link has expired or is invalid/i)).toBeInTheDocument();
      expect(screen.getByText(/Reset links are valid for 1 hour/i)).toBeInTheDocument();
    });
  });

  it('should show request new link button when link is expired', async () => {
    const user = userEvent.setup();
    renderUpdatePassword('/auth/update-password?error=expired_token');

    await waitFor(() => {
      const requestNewLinkButton = screen.getByRole('button', { name: /request new reset link/i });
      expect(requestNewLinkButton).toBeInTheDocument();
    });
  });

  it('should handle expired token error from Supabase during update', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      data: { user: null },
      error: { name: 'AuthApiError', message: 'Token expired' } as any,
    } as any);

    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];

    const validPassword = 'NewSecurePass123!';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText('Reset Link Expired')).toBeInTheDocument();
    });
  });

  // Password visibility toggle
  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0] as HTMLInputElement;
    const toggleButtons = screen.getAllByRole('button', { name: '' }); // Eye icon buttons

    expect(passwordInput.type).toBe('password');

    await user.click(toggleButtons[0]);
    expect(passwordInput.type).toBe('text');

    await user.click(toggleButtons[0]);
    expect(passwordInput.type).toBe('password');
  });

  // Loading state
  it('should show loading state while updating password', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.updateUser).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: { user: {} }, error: null } as any), 100))
    );

    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];

    const validPassword = 'NewSecurePass123!';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getByText(/updating password/i)).toBeInTheDocument();
  });

  // Navigation links
  it('should have back to login link', () => {
    renderUpdatePassword();
    
    const backLinks = screen.getAllByText('Back to Login');
    expect(backLinks.length).toBeGreaterThan(0);
    expect(backLinks[0].closest('a')).toHaveAttribute('href', '/auth');
  });

  // Error handling
  it('should handle generic update errors', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      data: { user: null },
      error: { name: 'AuthApiError', message: 'Something went wrong' } as any,
    } as any);

    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];

    const validPassword = 'NewSecurePass123!';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalled();
    });
  });

  // Supabase configuration check
  it('should handle unconfigured Supabase', async () => {
    const { isSupabaseConfigured } = await import('@/lib/supabase');
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);

    const user = userEvent.setup();
    renderUpdatePassword();

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];

    const validPassword = 'NewSecurePass123!';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(supabase.auth.updateUser).not.toHaveBeenCalled();
    });
  });
});
