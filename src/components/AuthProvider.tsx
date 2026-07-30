'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';

interface AuthContextType {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string;
  userId: string;
}

const AuthContext = createContext<AuthContextType>({
  status: 'loading',
  isAuthenticated: false,
  isLoading: true,
  userRole: 'student',
  userId: '',
});

export function useAuth() {
  return useContext(AuthContext);
}

function AuthSync({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const { user, loadProfile, clearUser } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      // Load profile from API if not already loaded or email mismatch
      if (!user || user.email !== session.user.email) {
        loadProfile();
      }
    } else if (status === 'unauthenticated') {
      clearUser();
    }
  }, [status, session?.user?.email]);

  const sessionUser = session?.user as Record<string, unknown> | undefined;

  return (
    <AuthContext.Provider
      value={{
        status,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
        userRole: (sessionUser?.role as string) || user?.role || 'student',
        userId: (sessionUser?.id as string) || user?.id || '',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthSync>{children}</AuthSync>
    </SessionProvider>
  );
}
