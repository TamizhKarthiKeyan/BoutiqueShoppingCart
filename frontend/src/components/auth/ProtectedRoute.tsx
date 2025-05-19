"use client";

import React, { useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { oktaAuth, authState } = useOktaAuth();

  useEffect(() => {
    if (!authState) {
      // If authState is null, we're still loading
      return;
    }

    if (!authState.isAuthenticated) {
      // Save the current URL to redirect back after login
      const originalUri = window.location.href;
      oktaAuth.setOriginalUri(originalUri);
    }
  }, [authState, oktaAuth]);

  // Show loading indicator while we're determining auth state
  if (!authState) {
    return <div className="flex justify-center items-center h-screen">Loading authentication...</div>;
  }

  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;