"use client";

import React, { useEffect, useState } from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { oktaConfig } from '../../oktaConfig';
import { OktaAuth } from "@okta/okta-auth-js";
import dynamic from 'next/dynamic';
import Login from "@/components/login/Login";

// Dynamically import the OktaWrapper component with no SSR
const OktaWrapper = dynamic(
  () => import('@/components/auth/OktaWrapper'),
  { ssr: false }
);

const Auth = () => {
  const [oktaAuth, setOktaAuth] = useState<OktaAuth | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    try {
      // Initialize OktaAuth on the client side
      const auth = new OktaAuth(oktaConfig);
      setOktaAuth(auth);
    } catch (error) {
      console.error("Error initializing Okta Auth:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <Theme accentColor="blue" appearance="light">
        <div className="flex justify-center items-center h-screen">
          <p>Loading authentication...</p>
        </div>
      </Theme>
    );
  }

  // If we're on the server or OktaAuth isn't initialized yet, show the regular login
  if (!isClient || !oktaAuth) {
    return (
      <Theme accentColor="blue" appearance="light">
        <Login />
      </Theme>
    );
  }

  // Use OktaWrapper for client-side authentication
  return (
    <Theme accentColor="blue" appearance="light">
      <OktaWrapper oktaAuth={oktaAuth} />
    </Theme>
  );
};

export default Auth;
