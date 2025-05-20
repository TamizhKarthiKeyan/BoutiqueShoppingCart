"use client";

import React, { useEffect, useState } from "react";
import { oktaConfig } from '@/oktaConfig';
import { OktaAuth } from "@okta/okta-auth-js";
import { useRouter } from 'next/navigation';
import OktaWrapper from '@/components/auth/OktaWrapper';

const LoginCallback = () => {
  const [oktaAuth, setOktaAuth] = useState<OktaAuth | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    try {
      // Initialize OktaAuth on the client side
      const auth = new OktaAuth(oktaConfig);
      setOktaAuth(auth);
      
      // Process the callback
      const handleCallback = async () => {
        try {
          // Parse the tokens from the URL
          await auth.handleLoginRedirect();
          
          // Get the original URI or default to dashboard
          const originalUri = auth.getOriginalUri() || '/dashboard';
          
          // Clear the original URI
          auth.setOriginalUri('');
          
          // Extract the path from the original URI
          const url = new URL(originalUri);
          const path = url.pathname;
          
          // Redirect to the original path or dashboard
          router.push(path);
        } catch (err) {
          console.error('Error handling callback:', err);
          setError('Failed to process login. Please try again.');
          setIsProcessing(false);
        }
      };
      
      handleCallback();
    } catch (error) {
      console.error("Error initializing Okta Auth:", error);
      setError('Failed to initialize authentication. Please try again.');
      setIsProcessing(false);
    }
  }, [router]);

  // If we're on the server or OktaAuth isn't initialized yet, show a loading state
  if (!isClient || !oktaAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Initializing authentication...</p>
      </div>
    );
  }

  // Show processing state while handling the callback
  if (isProcessing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Processing login...</p>
      </div>
    );
  }

  // Show error if there was an issue
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => router.push('/auth')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Return to Login
        </button>
      </div>
    );
  }

  // Use OktaWrapper to provide auth context
  return (
    <OktaWrapper oktaAuth={oktaAuth}>
      <div className="flex justify-center items-center h-screen">
        <p>Redirecting...</p>
      </div>
    </OktaWrapper>
  );
};

export default LoginCallback;