"use client";

import { OktaAuthOptions } from '@okta/okta-auth-js';

// Okta configuration
export const oktaConfig: OktaAuthOptions = {
  clientId: "0oaotnogvvUQWVgax5d7", // Client ID from backend/.env
  issuer: "https://dev-72218607.okta.com/oauth2/default", // Okta domain from backend/.env
  redirectUri: "http://localhost:3000/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
  tokenManager: {
    storage: 'localStorage'
  }
};
