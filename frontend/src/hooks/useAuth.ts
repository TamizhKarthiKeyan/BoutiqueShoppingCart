"use client";

import { useEffect, useState } from 'react';
import { OktaAuth, UserClaims } from '@okta/okta-auth-js';
import { oktaConfig } from '../oktaConfig';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserClaims | null;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserClaims | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [oktaAuth] = useState<OktaAuth>(() => new OktaAuth(oktaConfig));

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      try {
        const authenticated = await oktaAuth.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const userInfo = await oktaAuth.getUser();
          setUser(userInfo);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();

    // Subscribe to authentication state changes
    const handleAuthStateChange = (authState: { isAuthenticated: boolean }) => {
      setIsAuthenticated(authState.isAuthenticated);
      if (!authState.isAuthenticated) {
        setUser(null);
      }
    };

    oktaAuth.authStateManager.subscribe(handleAuthStateChange);

    return () => {
      oktaAuth.authStateManager.unsubscribe(handleAuthStateChange);
    };
  }, [oktaAuth]);

  const login = async (): Promise<void> => {
    try {
      await oktaAuth.signInWithRedirect();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await oktaAuth.signOut();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    logout
  };
};