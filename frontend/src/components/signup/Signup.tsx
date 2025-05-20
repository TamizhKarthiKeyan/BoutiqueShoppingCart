"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OktaAuth } from "@okta/okta-auth-js";
import { oktaConfig } from "@/oktaConfig";

const Signup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oktaAuth] = useState<OktaAuth>(() => new OktaAuth(oktaConfig));

  // Handle Okta signup
  const handleOktaSignup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Save the current URL to redirect back after signup
      const originalUri = window.location.origin + '/dashboard';
      await oktaAuth.setOriginalUri(originalUri);
      
      // Redirect to Okta signup page
      // Note: This requires self-registration to be enabled in your Okta tenant
      await oktaAuth.signInWithRedirect({
        scopes: oktaAuth.options.scopes || ['openid', 'email', 'profile'],
        responseType: ['code'],
        extraParams: {
          prompt: 'signup'
        }
      });
    } catch (err) {
      console.error('Error during Okta signup:', err);
      setError('Failed to initiate signup. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full p-20">
      {/* Left Div */}
      <div className="flex flex-col justify-center w-1/2 bg-white p-20">
        <div className="flex flex-col items-center justify-center">
          <p className="text-purple-900 text-3xl font-bold text-center">Boutique Laundry Service</p>
          <p className="text-[#565657] text-base font-bold text-center">They specialize in selling fashionable clothing, accessories, and sometimes unique gifts or home goods.</p>        
        </div>
        <div className="flex flex-col">
          <p className="text-[#565657] text-base font-bold text-center p-8">Already have an account?</p>
          <div className="flex justify-center text-white">
            <Link href="/auth">
              <Button 
                variant="outline" 
                size="custom" 
                className="text-black"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right Div */}
      <div className="flex flex-col justify-center w-1/2 p-4 pb-10 gap-4 sm:p-40 rounded shadow-lg bg-[#F8F9FE]">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-center">Register with Okta</h2>
          <p className="text-gray-600 text-center">
            Create an account using Okta's secure authentication service.
          </p>
          
          {error && (
            <div className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleOktaSignup}
            variant="outline" 
            size="custom" 
            className="text-white bg-[#5861AE] px-8 py-3"
            disabled={isLoading}
          >
            {isLoading ? "Redirecting..." : "Register with Okta"}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-gray-600">Or</p>
            <Link href="/auth/local/register" className="text-blue-600 hover:underline mt-2 inline-block">
              Register with email and password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;