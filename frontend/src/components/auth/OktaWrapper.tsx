"use client";

import React from "react";
import { Security, LoginCallback } from '@okta/okta-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OktaAuth } from "@okta/okta-auth-js";
import Login from "@/components/login/Login";
import Signup from "@/components/signup/Signup";

interface OktaWrapperProps {
  oktaAuth: OktaAuth;
}

const OktaWrapper: React.FC<OktaWrapperProps> = ({ oktaAuth }) => {
  return (
    <Router>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={(oktaAuth, originalUri) => {
        window.location.href = originalUri;
        return Promise.resolve();
      }}>
        <Routes>
          <Route path="/login/callback" Component={LoginCallback} />
          <Route path="/auth" Component={Login} />
          <Route path="/signup" Component={Signup} /> 
        </Routes>
      </Security>
    </Router>
  );
};

export default OktaWrapper;