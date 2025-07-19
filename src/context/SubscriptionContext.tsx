import React, { createContext, useContext, useEffect, useState } from 'react'
import { SubscriptionManager } from '@/lib/subscription'
import { useAuth } from './AuthContext'

type SubscriptionStatusType = 'free' | 'monthly' | 'yearly' | 'cancelled' | null;

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatusType
  aiGenerationsUsed: number
  aiGenerationsLimit: number
  exportsUsed: number
  exportsLimit: number
  isLoading: boolean
  canUseAI: boolean
  canExport: boolean
  refreshUsage: () => Promise<void>
  incrementAIUsage: () => Promise<void>
  incrementExportUsage: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatusType>(null)
  const [aiGenerationsUsed, setAIGenerationsUsed] = useState(0)
  const [aiGenerationsLimit, setAIGenerationsLimit] = useState(2) // Free tier default
  const [exportsUsed, setExportsUsed] = useState(0)
  const [exportsLimit, setExportsLimit] = useState(1) // Free tier default

  const refreshUsage = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const usage = await SubscriptionManager.getUserUsage(user.id)
      
      setSubscriptionStatus(usage.subscriptionStatus as SubscriptionStatusType)
      setAIGenerationsUsed(usage.aiGenerations.used)
      setAIGenerationsLimit(usage.aiGenerations.limit)
      setExportsUsed(usage.exports.used)
      setExportsLimit(usage.exports.limit)
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const incrementAIUsage = async () => {
    if (!user) return
    
    try {
      await SubscriptionManager.incrementUsage(user.id, 'ai_generation')
      // After incrementing, refresh the usage
      await refreshUsage()
    } catch (error) {
      console.error('Error incrementing AI usage:', error)
    }
  }

  const incrementExportUsage = async () => {
    if (!user) return
    
    try {
      await SubscriptionManager.incrementUsage(user.id, 'export')
      // After incrementing, refresh the usage
      await refreshUsage()
    } catch (error) {
      console.error('Error incrementing export usage:', error)
    }
  }

  // Check if user can use AI
  const canUseAI = subscriptionStatus === 'monthly' || 
                  subscriptionStatus === 'yearly' ||
                  aiGenerationsUsed < aiGenerationsLimit

  // Check if user can export
  const canExport = subscriptionStatus === 'monthly' || 
                   subscriptionStatus === 'yearly' ||
                   exportsUsed < exportsLimit

  useEffect(() => {
    refreshUsage()
  }, [user])

  const value = {
    subscriptionStatus,
    aiGenerationsUsed,
    aiGenerationsLimit,
    exportsUsed,
    exportsLimit,
    isLoading,
    canUseAI,
    canExport,
    refreshUsage,
    incrementAIUsage,
    incrementExportUsage,
  }

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}