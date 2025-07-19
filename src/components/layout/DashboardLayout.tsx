import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main content */}
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 px-4 md:px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}