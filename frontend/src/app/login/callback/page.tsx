"use client";

import React, { useEffect, useState } from "react";
import { oktaConfig } from '../../../oktaConfig';
import { OktaAuth } from "@okta/okta-auth-js";
import dynamic from 'next/dynamic';
import { Theme } from "@radix-ui/themes";

// Dynamically import the OktaWrapper component with no SSR
const OktaWrapper = dynamic(
  () => import('@/components/auth/OktaWrapper'),
  { ssr: false }
);

const LoginCallback = () => {
  const [oktaAuth, setOktaAuth] = useState<OktaAuth | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    try {
      // Initialize OktaAuth on the client side
      const auth = new OktaAuth(oktaConfig);
      setOktaAuth(auth);
    } catch (error) {
      console.error("Error initializing Okta Auth:", error);
    }
  }, []);

  // If we're on the server or OktaAuth isn't initialized yet, show a loading state
  if (!isClient || !oktaAuth) {
    return (
      <Theme accentColor="blue" appearance="light">
        <div className="flex justify-center items-center h-screen">
          <p>Processing login...</p>
        </div>
      </Theme>
    );
  }

  // Use OktaWrapper to handle the callback
  return (
    <Theme accentColor="blue" appearance="light">
      <OktaWrapper oktaAuth={oktaAuth} />
    </Theme>
  );
};

export default LoginCallback;