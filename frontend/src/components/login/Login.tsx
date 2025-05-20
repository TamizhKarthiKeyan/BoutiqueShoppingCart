"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

function Login() {
  const { login, isLoading, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(authError?.message || null);
  const router = useRouter();

  const handleOktaLogin = async () => {
    setError(null);
    try {
      await login();
      // The redirect will be handled by Okta
    } catch (err) {
      console.error('Error during login:', err);
      setError('Failed to initiate login. Please try again.');
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
      
      {/* Right Div */}
      <div className="flex flex-col justify-center w-1/2 p-4 pb-10 gap-4 sm:p-40 rounded shadow-lg bg-[#F8F9FE]">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-center">Sign in with Okta</h2>
          
          {error && (
            <div className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleOktaLogin}
            variant="outline" 
            size="custom" 
            className="text-white bg-[#5861AE] px-8 py-3"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In with Okta"}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-gray-600">Or</p>
            <Link href="/auth/local" className="text-blue-600 hover:underline mt-2 inline-block">
              Sign in with email and password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;