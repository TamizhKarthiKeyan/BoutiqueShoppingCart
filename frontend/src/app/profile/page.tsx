"use client";

import React, { useEffect, useState } from 'react';
import UserInfo from '@/components/auth/UserInfo';
import { useRouter } from 'next/navigation';
import { oktaConfig } from '@/oktaConfig';
import { OktaAuth } from '@okta/okta-auth-js';
import dynamic from 'next/dynamic';
import { Theme } from '@radix-ui/themes';

// Dynamically import the OktaWrapper component with no SSR
const OktaWrapper = dynamic(
  () => import('@/components/auth/OktaWrapper'),
  { ssr: false }
);

const ProfilePage = () => {
  const [oktaAuth, setOktaAuth] = useState<OktaAuth | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    try {
      // Initialize OktaAuth on the client side
      const auth = new OktaAuth(oktaConfig);
      setOktaAuth(auth);
      
      // Check if the user is authenticated
      const checkAuthentication = async () => {
        const isAuthenticated = await auth.isAuthenticated();
        if (!isAuthenticated) {
          // Redirect to auth page if not authenticated
          router.push('/auth');
        }
        setIsLoading(false);
      };
      
      checkAuthentication();
    } catch (error) {
      console.error("Error initializing Okta Auth:", error);
      setIsLoading(false);
      router.push('/auth');
    }
  }, [router]);

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

  // If we're on the server or OktaAuth isn't initialized yet, show a loading state
  if (!isClient || !oktaAuth) {
    return (
      <Theme accentColor="blue" appearance="light">
        <div className="flex justify-center items-center h-screen">
          <p>Initializing...</p>
        </div>
      </Theme>
    );
  }

  // Use OktaWrapper for client-side authentication
  return (
    <Theme accentColor="blue" appearance="light">
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <OktaWrapper oktaAuth={oktaAuth} />
        <UserInfo />
      </div>
    </Theme>
  );
};

export default ProfilePage;