'use client';

import React, { useState, useEffect } from 'react';
import { OktaAuth } from '@okta/okta-auth-js';
import { oktaConfig } from '@/oktaConfig';
import Login from '@/components/login/Login';
import OktaWrapper from '@/components/auth/OktaWrapper';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [oktaAuth, setOktaAuth] = useState<OktaAuth | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    try {
      // Initialize OktaAuth on the client side
      const auth = new OktaAuth(oktaConfig);
      setOktaAuth(auth);
      
      // Check if user is already authenticated
      const checkAuthStatus = async () => {
        const authState = await auth.authStateManager.getAuthState();
        if (authState?.isAuthenticated) {
          // If user is already authenticated, redirect to dashboard
          router.push('/dashboard');
        }
      };
      
      checkAuthStatus();
    } catch (error) {
      console.error("Error initializing Okta Auth:", error);
    }
  }, [router]);

  // If we're on the server or OktaAuth isn't initialized yet, show a loading state
  if (!isClient || !oktaAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading authentication...</p>
      </div>
    );
  }

  // Render the Login component wrapped in OktaWrapper
  return (
    <OktaWrapper oktaAuth={oktaAuth}>
      <Login />
    </OktaWrapper>
  );
}