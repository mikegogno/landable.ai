import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const location = useLocation();
  const { isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if this is a password update after clicking the reset link
  const isUpdatePassword = location.hash.includes('type=recovery');
  
  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        setIsResetSent(true);
        toast.success('Password reset link sent to your email!');
      }
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }
    
    // Check password confirmation
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully!');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {isUpdatePassword ? 'Reset your password' : 'Forgot your password?'}
            </CardTitle>
            <CardDescription>
              {isUpdatePassword 
                ? 'Enter a new password for your account' 
                : 'Enter your email address and we will send you a reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isUpdatePassword ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating password...' : 'Reset password'}
                </Button>
              </form>
            ) : (
              <>
                {isResetSent ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm">
                      Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsResetSent(false)}
                    >
                      Try again
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSendResetEmail} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
                    </Button>
                  </form>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-muted-foreground mx-auto">
              Remember your password?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}