import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { AuthService } from '@/lib/auth';
import { SubscriptionManager } from '@/lib/subscription';
import { AlertCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
  });
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  }>({
    status: 'free',
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  });
  
  // Form validation
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        if (profile) {
          setProfileData({
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            username: profile.username || '',
            phone: profile.phone || '',
          });
        }
        
        // Fetch subscription details
        const subscription = await SubscriptionManager.getUserSubscription(user.id);
        if (subscription) {
          setSubscriptionDetails({
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, profile]);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { firstName: '', lastName: '', username: '' };
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    
    if (!profileData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(profileData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) return;
    
    try {
      setIsLoading(true);
      await AuthService.updateProfile(user.id, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username,
        phone: profileData.phone,
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      await AuthService.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Current password is incorrect');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.')) {
      return;
    }
    
    try {
      setIsCancelling(true);
      await SubscriptionManager.cancelSubscription(user.id);
      
      setSubscriptionDetails({
        ...subscriptionDetails,
        cancelAtPeriodEnd: true,
      });
      
      toast.success('Subscription cancellation scheduled for the end of your current billing period');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
      
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                This will be used for your public portfolio URL: landable.ai/{profileData.username}
              </p>
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={profileData.phone || ''}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Update Profile'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Change Password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">
                {subscriptionDetails.status === 'free' && 'Free Plan'}
                {subscriptionDetails.status === 'monthly' && 'Monthly Premium'}
                {subscriptionDetails.status === 'yearly' && 'Yearly Premium'}
                {subscriptionDetails.status === 'cancelled' && 'Cancelled'}
              </h3>
              
              {subscriptionDetails.status !== 'free' && subscriptionDetails.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground">
                  {subscriptionDetails.cancelAtPeriodEnd 
                    ? `Access until: ${formatDate(subscriptionDetails.currentPeriodEnd)}`
                    : `Next billing date: ${formatDate(subscriptionDetails.currentPeriodEnd)}`}
                </p>
              )}
            </div>
            
            <div>
              {subscriptionDetails.status === 'free' ? (
                <Button onClick={() => window.location.href = '/pricing'}>
                  Upgrade
                </Button>
              ) : !subscriptionDetails.cancelAtPeriodEnd ? (
                <Button
                  variant="destructive"
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Processing...' : 'Cancel Subscription'}
                </Button>
              ) : (
                <Button disabled className="opacity-50">
                  Cancellation Scheduled
                </Button>
              )}
            </div>
          </div>
          
          {subscriptionDetails.status !== 'free' && (
            <div className="mt-4">
              <Button variant="outline" className="gap-2">
                <CreditCard className="h-4 w-4" /> Manage Payment Methods
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}