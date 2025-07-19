import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { PortfolioService } from '@/lib/portfolio';
import { Plus, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id?: string;
  title: string;
  description: string;
  image_url: string | null;
  external_link: string | null;
}

export default function PortfolioPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    title: '',
    description: '',
    image_url: null,
    external_link: null,
  });
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const portfolio = await PortfolioService.getPortfolio(user.id);
        
        if (portfolio) {
          setPortfolioId(portfolio.id);
          setBio(portfolio.bio || '');
          setIsPublic(portfolio.is_public);
          
          // Fetch projects
          const projectsData = await PortfolioService.getPortfolioProjects(portfolio.id);
          setProjects(projectsData || []);
        }
        
        // Get username
        if (user) {
          const profile = await PortfolioService.getUserProfile(user.id);
          if (profile) {
            setUsername(profile.username);
          }
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [user]);
  
  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      let portfolioData;
      if (!portfolioId) {
        // Create new portfolio
        portfolioData = await PortfolioService.createPortfolio({
          userId: user.id,
          bio,
          isPublic,
        });
        setPortfolioId(portfolioData.id);
      } else {
        // Update existing portfolio
        portfolioData = await PortfolioService.updatePortfolio(portfolioId, {
          bio,
          isPublic,
        });
      }
      
      toast.success('Portfolio saved successfully!');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast.error('Failed to save portfolio');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddProject = async () => {
    if (!portfolioId || !newProject.title || !newProject.description) {
      toast.error('Please provide a title and description for the project');
      return;
    }
    
    try {
      setIsSaving(true);
      const project = await PortfolioService.addProject(portfolioId, newProject);
      setProjects([...projects, project]);
      setNewProject({
        title: '',
        description: '',
        image_url: null,
        external_link: null,
      });
      toast.success('Project added successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await PortfolioService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        {isPublic && portfolioId && (
          <a
            href={`/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary"
          >
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" /> View Public Page
            </Button>
          </a>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Settings</CardTitle>
          <CardDescription>
            Configure your public portfolio page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="public">Public Portfolio</Label>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, your portfolio will be visible to the public at{' '}
              <span className="font-mono text-primary">/{username}</span>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a brief professional biography..."
              className="min-h-32"
            />
          </div>
          
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Showcase your work and experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {projects.length > 0 ? (
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => project.id && handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="text-muted-foreground mt-1">{project.description}</p>
                  {project.external_link && (
                    <a
                      href={project.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center mt-2 text-sm text-primary"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" /> {project.external_link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No projects yet. Add your first project below.</p>
            </div>
          )}
          
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-title">Project Title</Label>
                <Input
                  id="project-title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. Company Website Redesign"
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Briefly describe your role and accomplishments..."
                />
              </div>
              <div>
                <Label htmlFor="project-link">External Link (Optional)</Label>
                <Input
                  id="project-link"
                  value={newProject.external_link || ''}
                  onChange={(e) => setNewProject({ ...newProject, external_link: e.target.value || null })}
                  placeholder="https://example.com"
                />
              </div>
              <Button onClick={handleAddProject} disabled={isSaving}>
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}