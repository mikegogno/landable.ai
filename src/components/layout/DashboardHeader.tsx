import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSubscription } from '@/context/SubscriptionContext';

export default function DashboardHeader() {
  const { user, signOut } = useAuth();
  const { subscriptionStatus } = useSubscription();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <header className="border-b bg-white py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:hidden">Landable.ai</h1>
        
        <div className="flex-1 md:block hidden"></div>
        
        <div className="flex items-center gap-2">
          {/* Subscription status indicator */}
          <div className="mr-2 hidden md:block">
            <div className="text-sm">
              {subscriptionStatus === 'free' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/pricing')}
                  className="border-dashed"
                >
                  Upgrade to Premium
                </Button>
              )}
              {subscriptionStatus === 'monthly' && (
                <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Monthly Premium
                </span>
              )}
              {subscriptionStatus === 'yearly' && (
                <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Yearly Premium
                </span>
              )}
            </div>
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Bell size={18} />
          </Button>
          
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <span className="hidden md:inline">{user?.email}</span>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/pricing')}>
                Subscription
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:bg-red-50 focus:text-red-500">
                <LogOut size={16} className="mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}