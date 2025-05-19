"use client";

import { OktaAuthOptions } from '@okta/okta-auth-js';

// Okta configuration
export const oktaConfig: OktaAuthOptions = {
  clientId: "YwgrsYoK1LSPkVXTleX90rVyvjpWkheF", // Updated client ID
  issuer: "https://dev-12345678.okta.com/oauth2/default", // Replace with your actual Okta domain
  redirectUri: typeof window !== "undefined" 
    ? window.location.origin + "/login/callback" 
    : "",
  scopes: ["openid", "profile", "email", "api://default"],
  pkce: true,
  tokenManager: {
    storage: 'localStorage'
  }
};
