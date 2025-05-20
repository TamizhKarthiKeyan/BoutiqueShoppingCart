"use client";

import React, { useEffect, useState } from 'react';
import { OktaAuth, AuthState } from "@okta/okta-auth-js";
import { useRouter } from "next/navigation";

interface OktaWrapperProps {
  oktaAuth: OktaAuth;
  children: React.ReactNode;
}

const OktaWrapper: React.FC<OktaWrapperProps> = ({ oktaAuth, children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to authentication state changes
    const handleAuthStateChange = (newAuthState: AuthState) => {
      setAuthState(newAuthState);
      setIsLoading(false);
    };

    // Initialize auth state
    const initializeAuthState = async () => {
      try {
        const currentAuthState = await oktaAuth.authStateManager.getAuthState();
        setAuthState(currentAuthState);
      } catch (error) {
        console.error("Error getting auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    oktaAuth.authStateManager.subscribe(handleAuthStateChange);
    initializeAuthState();

    return () => {
      oktaAuth.authStateManager.unsubscribe(handleAuthStateChange);
    };
  }, [oktaAuth]);

  // Handle the restoration of the original URI after authentication
  useEffect(() => {
    if (authState?.isAuthenticated) {
      const originalUri = oktaAuth.getOriginalUri();
      if (originalUri) {
        // Extract the path from the original URI
        const url = new URL(originalUri);
        const path = url.pathname;
        
        // Clear the original URI
        oktaAuth.setOriginalUri('');
        
        // Use Next.js router to navigate
        router.push(path);
      }
    }
  }, [authState, oktaAuth, router]);

  // Show loading indicator while we're determining auth state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading authentication...</div>;
  }

  // Render children with auth context
  return <>{children}</>;
};

export default OktaWrapper;