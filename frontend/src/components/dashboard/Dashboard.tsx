"use client";

import React from 'react';
import { UserClaims } from '@okta/okta-auth-js';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";

interface DashboardProps {
  user: UserClaims;
}

function Dashboard({ user }: DashboardProps) {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by Okta
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="dashboard p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-900">Dashboard</h1>
        <Button 
          onClick={handleLogout}
          variant="outline" 
          size="custom" 
          className="text-white bg-[#5861AE] px-6 py-2"
          disabled={isLoading}
        >
          {isLoading ? "Signing Out..." : "Sign Out"}
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h2>
        
        <div className="user-info space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="info-item">
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            {user.preferred_username && (
              <div className="info-item">
                <p className="text-gray-500">Username</p>
                <p className="font-medium">{user.preferred_username}</p>
              </div>
            )}
            
            {user.locale && (
              <div className="info-item">
                <p className="text-gray-500">Locale</p>
                <p className="font-medium">{user.locale}</p>
              </div>
            )}
            
            {user.zoneinfo && (
              <div className="info-item">
                <p className="text-gray-500">Timezone</p>
                <p className="font-medium">{user.zoneinfo}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Authentication Details</h3>
            <p className="text-gray-700">
              You are authenticated via Okta SSO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;