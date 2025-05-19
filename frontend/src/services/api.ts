"use client";

import { OktaAuth } from '@okta/okta-auth-js';
import { oktaConfig } from '../oktaConfig';

// Initialize Okta Auth
const oktaAuth = typeof window !== 'undefined' ? new OktaAuth(oktaConfig) : null;

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get the access token
const getAccessToken = async (): Promise<string | null> => {
  if (!oktaAuth) return null;
  
  try {
    const { accessToken } = await oktaAuth.tokenManager.getTokens();
    return accessToken.accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

// Generic fetch function with authentication
const fetchWithAuth = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> => {
  const accessToken = await getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    ...options.headers
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }
  
  return response.json();
};

// API functions
export const api = {
  // Public endpoints
  public: {
    getPublicData: () => fetchWithAuth('/api/public')
  },
  
  // Protected endpoints (require authentication)
  protected: {
    getProtectedData: () => fetchWithAuth('/api/protected'),
    getUserProfile: () => fetchWithAuth('/api/user/profile')
  }
};

export default api;