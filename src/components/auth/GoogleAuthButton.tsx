import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { FcGoogle } from 'react-icons/fc';

interface GoogleAuthButtonProps {
  redirectTo?: string;
  label?: string;
  className?: string;
}

export default function GoogleAuthButton({
  redirectTo,
  label = 'Sign in with Google',
  className = '',
}: GoogleAuthButtonProps) {
  // Default redirect based on current origin
  const defaultRedirect = `${window.location.origin}/dashboard`;
  
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo || defaultRedirect,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Error signing in with Google:', error);
      }
    } catch (error) {
      console.error('Unexpected error during Google sign in:', error);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleSignIn}
      className={`w-full flex items-center justify-center ${className}`}
      variant="outline"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      {label}
    </Button>
  );
}