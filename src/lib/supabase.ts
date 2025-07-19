import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    'https://jyfudmsgzcqxfntoayox.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5ZnVkbXNnemNxeGZudG9heW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4Nzc1MTEsImV4cCI6MjA2ODQ1MzUxMX0.TWnFsLjxnJGtxKmLKEBg36lfphS8kjihC1RSHA2LAOA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for user profiles
export type UserProfile = {
  id: string;
  user_id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
};

// Database schema definitions
export const TABLES = {
  PROFILES: 'profiles',
  RESUMES: 'resumes',
  COVER_LETTERS: 'cover_letters',
  PORTFOLIOS: 'portfolios',
  TEMPLATES: 'templates',
  SUBSCRIPTIONS: 'subscriptions',
};

// Function to get user profile data
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

// Function to create or update user profile
export async function upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .upsert(profile)
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }
  
  return data;
}

// Function to handle user session
export async function handleUserSession(session: { user: { id: string; email?: string; user_metadata?: Record<string, string> } }) {
  if (!session?.user) return null;
  
  const userId = session.user.id;
  let profile = await getUserProfile(userId);
  
  // If profile doesn't exist, create a new one
  if (!profile) {
    const newProfile: Partial<UserProfile> = {
      user_id: userId,
      email: session.user.email,
      full_name: session.user.user_metadata?.full_name || '',
      avatar_url: session.user.user_metadata?.avatar_url || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    profile = await upsertUserProfile(newProfile);
  }
  
  return profile;
}