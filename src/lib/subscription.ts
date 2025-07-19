import { supabase } from './supabase'

export interface UsageLimits {
  aiGenerations: number
  exports: number
  publicProfiles: number
}

export const SUBSCRIPTION_LIMITS: Record<string, UsageLimits> = {
  free: {
    aiGenerations: 2,
    exports: 1,
    publicProfiles: 1,
  },
  monthly: {
    aiGenerations: -1, // unlimited
    exports: -1,
    publicProfiles: -1,
  },
  yearly: {
    aiGenerations: -1,
    exports: -1,
    publicProfiles: -1,
  },
}

export class SubscriptionManager {
  static async checkUserLimits(
    userId: string,
    action: 'ai_generation' | 'export' | 'profile_view'
  ): Promise<boolean> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('subscription_status, ai_generations_used, exports_used')
        .eq('id', userId)
        .single()

      if (error || !user) return false

      const limits = SUBSCRIPTION_LIMITS[user.subscription_status]

      switch (action) {
        case 'ai_generation':
          return limits.aiGenerations === -1 || user.ai_generations_used < limits.aiGenerations
        case 'export':
          return limits.exports === -1 || user.exports_used < limits.exports
        case 'profile_view':
          return true // No limits on profile views
        default:
          return false
      }
    } catch (error) {
      console.error('Check limits error:', error)
      return false
    }
  }

  static async incrementUsage(
    userId: string,
    action: 'ai_generation' | 'export'
  ): Promise<void> {
    try {
      const field = action === 'ai_generation' ? 'ai_generations_used' : 'exports_used'
      
      const { data: user } = await supabase
        .from('users')
        .select(field)
        .eq('id', userId)
        .single()
      
      if (!user) throw new Error('User not found')
      
      const { error } = await supabase
        .from('users')
        .update({ 
          [field]: (user[field as keyof typeof user] as number) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Increment usage error:', error)
      throw error
    }
  }

  static async getUserUsage(userId: string) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('subscription_status, ai_generations_used, exports_used')
        .eq('id', userId)
        .single()

      if (error || !user) throw error

      const limits = SUBSCRIPTION_LIMITS[user.subscription_status]

      return {
        subscriptionStatus: user.subscription_status,
        aiGenerations: {
          used: user.ai_generations_used,
          limit: limits.aiGenerations,
        },
        exports: {
          used: user.exports_used,
          limit: limits.exports,
        },
      }
    } catch (error) {
      console.error('Get usage error:', error)
      throw error
    }
  }

  static async resetUsageLimits(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ai_generations_used: 0,
          exports_used: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Reset usage error:', error)
      throw error
    }
  }
}