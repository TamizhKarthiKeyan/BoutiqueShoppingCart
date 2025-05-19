"use client";

import React from "react";
import { Security, LoginCallback } from '@okta/okta-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OktaAuth } from "@okta/okta-auth-js";
import OktaLoginPage from "@/components/auth/OktaLoginPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";

interface OktaWrapperProps {
  oktaAuth: OktaAuth;
}

const OktaWrapper: React.FC<OktaWrapperProps> = ({ oktaAuth }) => {
  const router = useRouter();

  // Handle the restoration of the original URI after authentication
  const restoreOriginalUri = async (oktaAuth: OktaAuth, originalUri: string) => {
    // Extract the path from the original URI
    const url = new URL(originalUri);
    const path = url.pathname;
    
    // Use Next.js router to navigate
    router.push(path);
    return Promise.resolve();
  };

  return (
    <Router>
      <Security 
        oktaAuth={oktaAuth} 
        restoreOriginalUri={restoreOriginalUri}
      >
        <Routes>
          <Route path="/login/callback" Component={LoginCallback} />
          <Route path="/auth" Component={OktaLoginPage} />
          <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
        </Routes>
      </Security>
    </Router>
  );
};

export default OktaWrapper;