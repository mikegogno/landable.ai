import { supabase } from './supabase'

export interface PortfolioData {
  bio: string
  isPublic: boolean
}

export interface PortfolioProjectData {
  title: string
  description: string
  imageUrl?: string
  externalLink?: string
}

export class PortfolioService {
  static async getPortfolio(userId: string) {
    try {
      // Check if portfolio exists
      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 means no rows returned

      // If portfolio doesn't exist, create one
      if (!portfolio) {
        const { data: newPortfolio, error: createError } = await supabase
          .from('portfolios')
          .insert({
            user_id: userId,
            bio: '',
            is_public: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (createError) throw createError
        
        // Get projects for the new portfolio
        const { data: projects } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('portfolio_id', newPortfolio.id)
        
        return {
          ...newPortfolio,
          projects: projects || [],
        }
      }

      // Get projects for existing portfolio
      const { data: projects } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('portfolio_id', portfolio.id)
      
      return {
        ...portfolio,
        projects: projects || [],
      }
    } catch (error) {
      console.error('Get portfolio error:', error)
      throw error
    }
  }

  static async updatePortfolio(portfolioId: string, portfolioData: Partial<PortfolioData>) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .update({
          bio: portfolioData.bio,
          is_public: portfolioData.isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq('id', portfolioId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update portfolio error:', error)
      throw error
    }
  }

  static async addProject(portfolioId: string, projectData: PortfolioProjectData) {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert({
          portfolio_id: portfolioId,
          title: projectData.title,
          description: projectData.description,
          image_url: projectData.imageUrl || null,
          external_link: projectData.externalLink || null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Add project error:', error)
      throw error
    }
  }

  static async updateProject(projectId: string, projectData: Partial<PortfolioProjectData>) {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .update({
          title: projectData.title,
          description: projectData.description,
          image_url: projectData.imageUrl,
          external_link: projectData.externalLink,
        })
        .eq('id', projectId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update project error:', error)
      throw error
    }
  }

  static async deleteProject(projectId: string) {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error
    } catch (error) {
      console.error('Delete project error:', error)
      throw error
    }
  }

  static async getPublicPortfolio(username: string) {
    try {
      // Get user by username
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

      if (userError) throw userError

      // Get portfolio
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_public', true)
        .single()

      if (portfolioError) throw portfolioError

      // Get projects
      const { data: projects, error: projectsError } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('portfolio_id', portfolio.id)

      if (projectsError) throw projectsError

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('first_name, last_name, profile_image')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      return {
        ...portfolio,
        projects: projects || [],
        user: {
          username,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          profileImage: userProfile.profile_image,
        },
      }
    } catch (error) {
      console.error('Get public portfolio error:', error)
      throw error
    }
  }
}