'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <ProtectedRoute>       
      {user ? (
        <Dashboard user={user} />
      ) : (
        <div className="flex justify-center items-center h-screen">
          User information not available
        </div>
      )}
    </ProtectedRoute>
  );
}