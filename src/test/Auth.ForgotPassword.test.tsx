import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Auth from '@/pages/Auth';

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
  isSupabaseConfigured: vi.fn(() => true),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    signOut: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderAuth = () => {
  return render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
};

describe('Auth Component - Password Reset Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // AC1: Access Reset Page - Forgot Password link
  it('should display "Forgot Password?" link on login tab', async () => {
    renderAuth();

    // Ensure we're on the login tab
    const loginTab = screen.getByRole('tab', { name: /login/i });
    expect(loginTab).toHaveAttribute('data-state', 'active');

    // Check for Forgot Password link
    const forgotPasswordLink = screen.getByText('Forgot Password?');
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  it('should navigate to /auth/reset-password when clicking Forgot Password link', async () => {
    const user = userEvent.setup();
    renderAuth();

    const forgotPasswordLink = screen.getByText('Forgot Password?');
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/auth/reset-password');
  });

  it('should only show Forgot Password link on login tab, not register tab', async () => {
    const user = userEvent.setup();
    renderAuth();

    // Login tab should have the link
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();

    // Switch to register tab
    const registerTab = screen.getByRole('tab', { name: /register/i });
    await user.click(registerTab);

    // Wait for tab animation to complete
    await waitFor(() => {
      expect(registerTab).toHaveAttribute('data-state', 'active');
    });

    // Forgot Password link should not be visible on register tab
    // Note: It's still in the DOM but hidden via AnimatePresence
    const loginTab = screen.getByRole('tab', { name: /login/i });
    expect(loginTab).toHaveAttribute('data-state', 'inactive');
  });

  it('should have correct styling for Forgot Password link', () => {
    renderAuth();

    const forgotPasswordLink = screen.getByText('Forgot Password?');
    expect(forgotPasswordLink).toHaveClass('text-sm');
    expect(forgotPasswordLink).toHaveClass('text-muted-foreground');
    expect(forgotPasswordLink).toHaveClass('hover:text-primary');
  });
});
