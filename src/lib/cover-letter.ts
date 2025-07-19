import { supabase } from './supabase'
import { AIService } from './ai'

export interface CoverLetterData {
  jobTitle: string
  company: string
  tone: 'casual' | 'formal' | 'confident'
  jobDescription?: string
  content: string
}

export class CoverLetterService {
  static async getCoverLetters(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get cover letters error:', error)
      throw error
    }
  }

  static async getCoverLetter(id: string) {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get cover letter error:', error)
      throw error
    }
  }

  static async createCoverLetter(userId: string, coverLetterData: CoverLetterData) {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .insert({
          user_id: userId,
          job_title: coverLetterData.jobTitle,
          company: coverLetterData.company,
          tone: coverLetterData.tone,
          job_description: coverLetterData.jobDescription || null,
          content: coverLetterData.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Create cover letter error:', error)
      throw error
    }
  }

  static async updateCoverLetter(id: string, coverLetterData: Partial<CoverLetterData>) {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .update({
          ...coverLetterData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update cover letter error:', error)
      throw error
    }
  }

  static async deleteCoverLetter(id: string) {
    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Delete cover letter error:', error)
      throw error
    }
  }

  static async generateCoverLetter(
    jobTitle: string,
    company: string,
    jobDescription: string,
    tone: 'casual' | 'formal' | 'confident'
  ) {
    try {
      return await AIService.generateCoverLetter(
        jobTitle,
        company,
        jobDescription,
        tone
      )
    } catch (error) {
      console.error('Generate cover letter error:', error)
      throw error
    }
  }

  static async optimizeCoverLetter(content: string) {
    try {
      return await AIService.optimizeContent(content, 'cover_letter')
    } catch (error) {
      console.error('Optimize cover letter error:', error)
      throw error
    }
  }
}