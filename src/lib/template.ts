import { supabase } from './supabase'

export interface TemplateConfiguration {
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  layout: string;
  headingStyle?: string;
}

export interface TemplateData {
  id: string
  name: string
  type: 'resume' | 'cover_letter'
  thumbnailUrl: string
  configuration: TemplateConfiguration
}

export class TemplateService {
  static async getResumeTemplates() {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('type', 'resume')
        .order('name')

      if (error) throw error
      
      return data || this.getDefaultResumeTemplates()
    } catch (error) {
      console.error('Get resume templates error:', error)
      // Fallback to default templates
      return this.getDefaultResumeTemplates()
    }
  }

  static async getCoverLetterTemplates() {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('type', 'cover_letter')
        .order('name')

      if (error) throw error
      
      return data || this.getDefaultCoverLetterTemplates()
    } catch (error) {
      console.error('Get cover letter templates error:', error)
      // Fallback to default templates
      return this.getDefaultCoverLetterTemplates()
    }
  }

  static async getTemplateById(id: string) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get template by id error:', error)
      
      // Try to find in default templates
      const allDefaults = [
        ...this.getDefaultResumeTemplates(),
        ...this.getDefaultCoverLetterTemplates(),
      ]
      
      return allDefaults.find(t => t.id === id)
    }
  }

  static getDefaultResumeTemplates() {
    return [
      {
        id: 'modern-1',
        name: 'Modern Professional',
        type: 'resume',
        thumbnailUrl: '/templates/modern-professional.png',
        configuration: {
          fontFamily: 'Inter',
          primaryColor: '#7C3AED',
          secondaryColor: '#E5E7EB',
          layout: 'standard',
          headingStyle: 'uppercase',
        },
      },
      {
        id: 'minimalist-1',
        name: 'Clean Minimalist',
        type: 'resume',
        thumbnailUrl: '/templates/clean-minimalist.png',
        configuration: {
          fontFamily: 'Inter',
          primaryColor: '#111827',
          secondaryColor: '#9CA3AF',
          layout: 'sidebar',
          headingStyle: 'normal',
        },
      },
      {
        id: 'executive-1',
        name: 'Executive Suite',
        type: 'resume',
        thumbnailUrl: '/templates/executive-suite.png',
        configuration: {
          fontFamily: 'Inter',
          primaryColor: '#1E3A8A',
          secondaryColor: '#BFDBFE',
          layout: 'header',
          headingStyle: 'underlined',
        },
      },
    ]
  }

  static getDefaultCoverLetterTemplates() {
    return [
      {
        id: 'cl-modern-1',
        name: 'Modern Professional',
        type: 'cover_letter',
        thumbnailUrl: '/templates/cl-modern.png',
        configuration: {
          fontFamily: 'Inter',
          primaryColor: '#7C3AED',
          secondaryColor: '#E5E7EB',
          layout: 'standard',
        },
      },
      {
        id: 'cl-minimal-1',
        name: 'Clean Minimalist',
        type: 'cover_letter',
        thumbnailUrl: '/templates/cl-minimal.png',
        configuration: {
          fontFamily: 'Inter',
          primaryColor: '#111827',
          secondaryColor: '#9CA3AF',
          layout: 'simple',
        },
      },
      {
        id: 'cl-bold-1',
        name: 'Bold Statement',
        type: 'cover_letter',
        thumbnailUrl: '/templates/cl-bold.png',
        configuration: {
          fontFamily: 'Inter',
          primaryColor: '#7C3AED',
          secondaryColor: '#84CC16',
          layout: 'feature',
        },
      },
    ]
  }
}