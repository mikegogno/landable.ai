import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Mail, Linkedin, Github } from 'lucide-react';
import { PortfolioService } from '@/lib/portfolio';
import Footer from '@/components/layout/Footer';

interface ProjectType {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  external_link: string | null;
}

interface UserType {
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export default function PublicPortfolioPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<{
    bio: string;
    projects: ProjectType[];
    user: UserType;
  } | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!username) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        const data = await PortfolioService.getPublicPortfolio(username);
        setPortfolioData(data);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Portfolio not found or is set to private.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [username, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 flex items-center justify-center flex-col space-y-4 p-6 text-center">
          <h1 className="text-3xl font-bold">Portfolio Not Found</h1>
          <p className="text-muted-foreground">{error || 'This portfolio does not exist or is not public.'}</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { user, bio, projects } = portfolioData;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with user info */}
      <header className="w-full bg-gradient-to-br from-primary/10 to-primary/5 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative h-32 w-32 md:h-40 md:w-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.firstName} {user.lastName}</h1>
              <p className="text-lg text-muted-foreground mb-4">@{user.username}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bio section */}
      <section className="w-full py-12 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-6">About Me</h2>
          <div className="prose max-w-none">
            {bio.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4 text-gray-700">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Projects section */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">Projects</h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
                  {project.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className={project.image_url ? 'pt-6' : 'pt-0 mt-6'}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      {project.external_link && (
                        <a 
                          href={project.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-gray-600">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Created with Landable.ai */}
      <section className="w-full py-8 bg-white border-t">
        <div className="container px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            This portfolio was created with{" "}
            <Link to="/" className="text-primary hover:underline">
              Landable.ai
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}