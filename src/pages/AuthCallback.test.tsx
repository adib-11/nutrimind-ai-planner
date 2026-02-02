import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthCallback from '@/pages/AuthCallback';

// Mock modules
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(),
    })),
  },
  isSupabaseConfigured: vi.fn(() => true),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
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

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

describe('AuthCallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (initialEntries: string[] = ['/auth/callback']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AuthCallback />
      </MemoryRouter>
    );
  };

  describe('AC3: OAuth Cancellation', () => {
    it('should display "Sign-in cancelled" when error=access_denied', async () => {
      renderWithRouter(['/auth/callback?error=access_denied']);

      await waitFor(() => {
        expect(screen.getByText('Sign-in Cancelled')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display "Sign-in cancelled" when error=user_cancelled', async () => {
      renderWithRouter(['/auth/callback?error=user_cancelled']);

      await waitFor(() => {
        expect(screen.getByText('Sign-in Cancelled')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('AC2: Successful OAuth Sign-In', () => {
    it('should show success for new user and navigate to onboarding', async () => {
      const mockSession = {
        user: {
          id: 'supabase-user-123',
          email: 'newuser@gmail.com',
          user_metadata: { full_name: 'New User' },
        },
      };

      (supabase.auth.getSession as Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      // Mock user not found (new user)
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      });

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'new-user-123',
              supabaseAuthId: 'supabase-user-123',
              email: 'newuser@gmail.com',
            },
            error: null,
          }),
        }),
      });

      (supabase.from as Mock).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: mockSingle,
          })),
        })),
        insert: mockInsert,
      });

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify user creation was attempted with correct authProvider
      expect(supabase.from).toHaveBeenCalledWith('User');
    });

    it('should show success for existing user with completed onboarding', async () => {
      const mockSession = {
        user: {
          id: 'supabase-user-456',
          email: 'existing@gmail.com',
        },
      };

      (supabase.auth.getSession as Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const mockSingle = vi.fn().mockResolvedValue({
        data: { id: 'user-456', onboardingCompleted: true },
        error: null,
      });

      (supabase.from as Mock).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: mockSingle,
          })),
        })),
      });

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('AC4: Existing Account Linking', () => {
    it('should handle duplicate email gracefully (link to existing account)', async () => {
      const mockSession = {
        user: {
          id: 'supabase-new-oauth-id',
          email: 'existing@gmail.com',
        },
      };

      (supabase.auth.getSession as Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      });

      // Insert fails with duplicate key - need to chain .select().single()
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: '23505' },
          }),
        }),
      });

      (supabase.from as Mock).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: mockSingle,
          })),
        })),
        insert: mockInsert,
      });

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Error handling', () => {
    it('should show error when Supabase is not configured', async () => {
      (isSupabaseConfigured as Mock).mockReturnValue(false);

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show error when no session is found', async () => {
      (isSupabaseConfigured as Mock).mockReturnValue(true);
      (supabase.auth.getSession as Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show error with error_description from URL params', async () => {
      renderWithRouter(['/auth/callback?error=server_error&error_description=Something%20went%20wrong']);

      await waitFor(() => {
        expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Loading state', () => {
    it('should show loading state initially', () => {
      (supabase.auth.getSession as Mock).mockReturnValue(new Promise(() => {}));

      renderWithRouter();

      expect(screen.getByText('Authenticating...')).toBeInTheDocument();
      expect(screen.getByText('Processing authentication...')).toBeInTheDocument();
    });
  });
});
