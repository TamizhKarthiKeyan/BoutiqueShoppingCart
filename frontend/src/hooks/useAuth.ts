"use client";

import { useEffect, useState } from 'react';
import { OktaAuth, UserClaims, AuthState } from '@okta/okta-auth-js';
import { oktaConfig } from '../oktaConfig';
import { useRouter } from 'next/navigation';

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
  const [oktaAuth] = useState<OktaAuth>(() => {
    // Only initialize OktaAuth on the client side
    if (typeof window === 'undefined') {
      return null as unknown as OktaAuth;
    }
    return new OktaAuth(oktaConfig);
  });
  const router = useRouter();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    const checkAuthentication = async () => {
      setIsLoading(true);
      try {
        // Check if there are tokens in the URL (after redirect)
        if (window.location.search.includes('code=') || 
            window.location.search.includes('token=') || 
            window.location.search.includes('id_token=')) {
          try {
            await oktaAuth.token.parseFromUrl();
            console.log('Successfully parsed tokens from URL');
          } catch (parseError) {
            console.error('Error parsing tokens from URL:', parseError);
          }
        }

        const authenticated = await oktaAuth.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const userInfo = await oktaAuth.getUser();
          setUser(userInfo);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();

    // Subscribe to authentication state changes
    const handleAuthStateChange = (authState: AuthState) => {
      // Handle the case where isAuthenticated might be undefined
      const isAuthenticatedValue = !!authState.isAuthenticated;
      setIsAuthenticated(isAuthenticatedValue);
      
      if (!isAuthenticatedValue) {
        setUser(null);
      } else if (isAuthenticatedValue && !user) {
        // If we just became authenticated, get the user info
        oktaAuth.getUser().then(userInfo => {
          setUser(userInfo);
        }).catch(err => {
          console.error('Error getting user info:', err);
        });
      }
    };

    oktaAuth.authStateManager.subscribe(handleAuthStateChange);

    return () => {
      oktaAuth.authStateManager.unsubscribe(handleAuthStateChange);
    };
  }, [oktaAuth, user]);

  const login = async (): Promise<void> => {
    try {
      // For debugging
      console.log('Login config:', {
        clientId: oktaAuth.options.clientId,
        redirectUri: oktaAuth.options.redirectUri,
        issuer: oktaAuth.options.issuer
      });
      
      // Set the original URI to return to after authentication
      oktaAuth.setOriginalUri('/dashboard');
      
      // Use the Sign-In Widget instead of redirect
      router.push('/auth');
    } catch (err) {
      console.error('Login error:', err);
      setError(err as Error);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await oktaAuth.signOut();
      router.push('/auth');
    } catch (err) {
      console.error('Logout error:', err);
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