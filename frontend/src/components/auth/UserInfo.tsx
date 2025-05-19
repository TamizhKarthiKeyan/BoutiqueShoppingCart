"use client";

import React, { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { AlertCircle } from 'lucide-react';

interface UserProfile {
  name?: string;
  email?: string;
  preferred_username?: string;
  sub?: string;
  [key: string]: any;
}

const UserInfo = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authState || !authState.isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // First try to get user info from the backend API
        const response = await api.protected.getUserProfile();
        setUserProfile(response.profile);
      } catch (apiError) {
        console.error('Error fetching from API:', apiError);
        
        try {
          // Fallback to getting user info directly from Okta
          const userInfo = await oktaAuth.getUser();
          setUserProfile(userInfo);
        } catch (oktaError) {
          console.error('Error fetching from Okta:', oktaError);
          setError('Failed to fetch user information');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [authState, oktaAuth]);

  const handleLogout = async () => {
    try {
      await oktaAuth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex justify-center">
        <div className="animate-pulse">Loading user information...</div>
      </div>
    );
  }

  if (!authState?.isAuthenticated || !userProfile) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <div className="text-center">
          <p>Not logged in or unable to fetch user data</p>
          {error && (
            <div className="text-red-500 text-sm mt-2 flex items-center justify-center">
              <AlertCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="text-xl font-medium text-black">User Profile</div>
        
        {error && (
          <div className="text-red-500 text-sm flex items-center">
            <AlertCircle size={16} className="mr-1" />
            {error}
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          {userProfile.name && (
            <div className="flex">
              <span className="font-bold w-24">Name:</span>
              <span>{userProfile.name}</span>
            </div>
          )}
          
          {userProfile.email && (
            <div className="flex">
              <span className="font-bold w-24">Email:</span>
              <span>{userProfile.email}</span>
            </div>
          )}
          
          {userProfile.preferred_username && (
            <div className="flex">
              <span className="font-bold w-24">Username:</span>
              <span>{userProfile.preferred_username}</span>
            </div>
          )}
          
          {userProfile.sub && (
            <div className="flex">
              <span className="font-bold w-24">User ID:</span>
              <span className="truncate max-w-xs">{userProfile.sub}</span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;