import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  username: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  static async signUp(data: SignUpData): Promise<User | null> {
    try {
      // Check if username is available
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', data.username)
        .single()

      if (existingUser) {
        throw new Error('Username already taken')
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            username: data.username,
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone || null,
            subscription_status: 'free',
            ai_generations_used: 0,
            exports_used: 0,
          })

        if (profileError) throw profileError
      }

      return authData.user
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  static async signIn(data: SignInData): Promise<User | null> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error
      return authData.user
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  static async signInWithMagicLink(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      })

      if (error) throw error
    } catch (error) {
      console.error('Magic link error:', error)
      throw error
    }
  }

  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get user profile error:', error)
      throw error
    }
  }

  static async updateProfile(userId: string, data: {
    first_name?: string
    last_name?: string
    username?: string
    phone?: string
    profile_image?: string
  }) {
    try {
      // Check username availability if changing username
      if (data.username) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('username', data.username)
          .neq('id', userId)
          .single()

        if (existingUser) {
          throw new Error('Username already taken')
        }
      }

      const { error } = await supabase
        .from('users')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }
}