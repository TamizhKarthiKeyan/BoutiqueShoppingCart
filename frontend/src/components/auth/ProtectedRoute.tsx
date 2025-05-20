"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OktaAuth, AuthState } from '@okta/okta-auth-js';
import { oktaConfig } from '@/oktaConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [oktaAuth] = useState<OktaAuth>(() => new OktaAuth(oktaConfig));

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthentication = async () => {
      try {
        const authState = await oktaAuth.authStateManager.getAuthState();
        setIsAuthenticated(authState?.isAuthenticated || false);
        
        if (!authState?.isAuthenticated) {
          // Save the current URL to redirect back after login
          const originalUri = window.location.href;
          await oktaAuth.setOriginalUri(originalUri);
          
          // Redirect to auth page
          router.push('/auth');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        router.push('/auth');
      }
    };

    // Subscribe to authentication state changes
    const handleAuthStateChange = (authState: AuthState) => {
      setIsAuthenticated(authState.isAuthenticated || false);
      if (!authState.isAuthenticated) {
        router.push('/auth');
      }
    };

    oktaAuth.authStateManager.subscribe(handleAuthStateChange);
    checkAuthentication();

    return () => {
      oktaAuth.authStateManager.unsubscribe(handleAuthStateChange);
    };
  }, [oktaAuth, router]);

  // Show loading indicator while we're determining auth state
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Loading authentication...</div>;
  }

  // If not authenticated, we're already redirecting
  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Redirecting to login...</div>;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;