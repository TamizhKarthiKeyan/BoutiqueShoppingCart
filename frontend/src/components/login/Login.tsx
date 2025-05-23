"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { oktaConfig } from '@/oktaConfig';
import { OktaAuth } from '@okta/okta-auth-js';
// Import Okta Sign-In Widget styles only (not the component)
import '@okta/okta-signin-widget/css/okta-sign-in.min.css';

interface LoginProps {
  mode?: 'okta' | 'local';
}

function Login({ mode = 'okta' }: LoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle local login form submission
  const handleLocalLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your local login logic here
    // For now, just redirect to dashboard
    router.push('/dashboard');
  };

  // Only initialize Okta widget if in Okta mode
  useEffect(() => {
    // Skip if not in Okta mode or not in browser or no ref
    if (mode !== 'okta' || typeof window === 'undefined' || !widgetRef.current) return;

    // Set loading state
    setIsLoading(true);

    // Dynamically import the Okta Sign-In Widget
    import('@okta/okta-signin-widget').then(({ OktaSignIn }) => {
      // Initialize the Okta Sign-In Widget
      const signIn = new OktaSignIn({
        // For development only - use a CORS proxy
        baseUrl: 'https://dev-72218607.okta.com',
        clientId: oktaConfig.clientId,
        redirectUri: oktaConfig.redirectUri,
        authParams: {
          issuer: oktaConfig.issuer,
          responseType: ['token', 'id_token'],
          scopes: oktaConfig.scopes,
          prompt: 'login', // Valid values: none, consent, login
        },
        features: {
          registration: true,
          rememberMe: true,
          showPasswordToggleOnSignInPage: true,
        },
        // Add CORS support for local development
        useClassicEngine: true, // Use classic engine to avoid CORS issues
        // Additional CORS settings
        corsPolicy: 'CORS_POLICY_WILDCARD',
        i18n: {
          en: {
            'primaryauth.title': 'Sign in to Boutique Shopping Cart',
          },
        },
        // Remove logo reference since the file doesn't exist
        colors: {
          brand: '#5861AE',
          innerWidthoutLogo: true,
          showRememberMe: true,
        },
      });

      // Render the widget
      signIn.renderEl(
        { el: '#okta-signin-container' },
        (res) => {
          if (res.status === 'SUCCESS') {
            // Create an OktaAuth instance to handle the tokens
            const oktaAuth = new OktaAuth(oktaConfig);
            
            // Store the tokens if they exist
            if (res.tokens) {
              oktaAuth.tokenManager.setTokens(res.tokens);
              
              // Redirect to dashboard
              router.push('/dashboard');
            } else {
              console.error('No tokens received from Okta');
              setError('Authentication failed. Please try again.');
            }
          }
          setIsLoading(false);
        },
        (err) => {
          console.error('Error rendering Okta Sign-In Widget:', err);
          setError('Failed to load the sign-in widget. Please try again.');
          setIsLoading(false);
        }
      );

      // Return the cleanup function
      // This will be called when the component unmounts or when the dependencies change
    }).catch(err => {
      console.error('Error loading Okta Sign-In Widget:', err);
      setError('Failed to load the sign-in widget. Please try again.');
      setIsLoading(false);
    });

    // Cleanup function for the useEffect
    return () => {
      const container = document.getElementById('okta-signin-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [router, mode]);

  const handleLocalLogin = () => {
    router.push('/auth/local/login');
  };

  // Render local login form
  if (mode === 'local') {
    return (
      <div className="flex min-h-screen w-full p-20">
        {/* Left Div */}
       <div className="flex flex-col justify-center w-1/2 bg-white p-20">
          <div className="flex flex-col items-center justify-center">
            <p className="text-purple-900 text-3xl font-bold text-center">Boutique Laundry Service</p>
            <p className="text-[#565657] text-base font-bold text-center">They specialize in selling fashionable clothing, accessories, and sometimes unique gifts or home goods.</p>        
          </div>
          <div className="flex flex-col">
            <p className="text-[#565657] text-base font-bold text-center p-8">Don't have an account?</p>
            <div className="flex justify-center text-white">
              <Link href="/signup">
                <Button 
                  variant="outline" 
                  size="custom" 
                  className="text-black"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Div - Local Login Form */}
        <div className="flex flex-col justify-center w-1/2 p-4 pb-10 gap-4 sm:p-40 rounded shadow-lg bg-[#F8F9FE]">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold text-center">Sign in with Email and Password</h2>
            
            {error && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {error}
              </div>
            )}
            
            {/* Local Login Form */}
            <form onSubmit={handleLocalLoginSubmit} className="w-full space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>
              </div>
            </form>
            
            <div className="text-center mt-4">
              <p className="text-gray-600">Or</p>
              <Link href="/auth">
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:underline mt-2"
                >
                  Sign in with Okta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Okta Sign-In Widget (default)
  return (
    <div className="flex min-h-screen w-full p-10">
      {/* Left Div */}
     {/* <div className="flex flex-col justify-center w-1/2 bg-white p-20">
        <div className="flex flex-col items-center justify-center">
          <p className="text-purple-900 text-3xl font-bold text-center">Boutique Laundry Service</p>
          <p className="text-[#565657] text-base font-bold text-center">They specialize in selling fashionable clothing, accessories, and sometimes unique gifts or home goods.</p>        
        </div>
        <div className="flex flex-col">
          <p className="text-[#565657] text-base font-bold text-center p-8">Don't have an account?</p>
          <div className="flex justify-center text-white">
            <Link href="/signup">
              <Button 
                variant="outline" 
                size="custom" 
                className="text-black"
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>*/}
      
      {/* Right Div - Okta Widget */}
      <div className="flex flex-col justify-center  min-h-screen w-full  pb-10 sm:p-10 rounded shadow-lg bg-[#F8F9FE]">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-center">Sign in to Your Account</h2>
          
          {error && (
            <div className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
          
          {/* Okta Sign-In Widget Container */}
          <div ref={widgetRef} id="okta-signin-container" className="w-full">
            {/* {!isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading sign-up widget...</span>
              </div>
            )} */}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-gray-600">Or</p>
            <Button 
              onClick={handleLocalLogin}
              variant="link" 
              className="text-blue-600 hover:underline mt-2"
            >
              Sign in with email and password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;