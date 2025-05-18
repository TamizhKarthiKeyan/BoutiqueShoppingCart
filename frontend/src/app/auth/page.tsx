"use client";

import Login from "@/components/login/Login";
import React, { useEffect, useState } from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { oktaConfig } from '../../oktaConfig';
import { OktaAuth } from "@okta/okta-auth-js";
import dynamic from 'next/dynamic';

// Dynamically import the OktaWrapper component with no SSR
const OktaWrapper = dynamic(
  () => import('@/components/auth/OktaWrapper'),
  { ssr: false }
);

const Auth = () => {
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

  // If we're on the server or OktaAuth isn't initialized yet, show a simple version
  if (!isClient || !oktaAuth) {
    return (
      <Theme accentColor="blue" appearance="light">
        <Login />
      </Theme>
    );
  }

  // Just render the Login component directly instead of using OktaWrapper
  // This avoids mixing Next.js routing with React Router
  return (
    <Theme accentColor="blue" appearance="light">
      <Login />
    </Theme>
  );
};

export default Auth;
