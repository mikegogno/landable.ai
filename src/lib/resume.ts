import { supabase } from './supabase'
import { AIService } from './ai'

export interface ResumeData {
  title: string
  templateId: string
  jobDescription?: string
  content: {
    personalInfo: {
      name: string
      email: string
      phone: string
      location: string
    }
    summary: string
    experience: Array<{
      title: string
      company: string
      duration: string
      bullets: string[]
    }>
    education: Array<{
      degree: string
      school: string
      year: string
    }>
    skills: string[]
  }
}

export type ResumeContent = ResumeData['content'];

export class ResumeService {
  static async getResumes(userId: string) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get resumes error:', error)
      throw error
    }
  }

  static async getResume(id: string) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get resume error:', error)
      throw error
    }
  }

  static async createResume(userId: string, resumeData: Omit<ResumeData, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          title: resumeData.title,
          template_id: resumeData.templateId,
          job_description: resumeData.jobDescription || null,
          content: resumeData.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Create resume error:', error)
      throw error
    }
  }

  static async updateResume(id: string, resumeData: Partial<ResumeData>) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .update({
          ...resumeData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update resume error:', error)
      throw error
    }
  }

  static async deleteResume(id: string) {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Delete resume error:', error)
      throw error
    }
  }

  static async generateBulletPoints(experience: string, jobDescription: string) {
    try {
      return await AIService.generateBulletPoints(experience, jobDescription)
    } catch (error) {
      console.error('Generate bullets error:', error)
      throw error
    }
  }

  static async optimizeForATS(resumeContent: ResumeContent) {
    try {
      // Convert resume content to string format for optimization
      const contentStr = JSON.stringify(resumeContent)
      const optimized = await AIService.optimizeContent(contentStr, 'resume')
      
      // In a real implementation, we'd need to parse the optimized content back to proper format
      // This is simplified for demo purposes
      return resumeContent
    } catch (error) {
      console.error('Optimize resume error:', error)
      throw error
    }
  }
}