import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { ResumeService } from '@/lib/resume';
import { CoverLetterService } from '@/lib/cover-letter';
import { PortfolioService } from '@/lib/portfolio';
import { FileText, MessageSquare, User, Plus, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { subscriptionStatus } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  interface ResumeItem {
    id: string;
    title: string;
    updated_at: string;
  }
  
  interface CoverLetterItem {
    id: string;
    job_title: string;
    company: string;
    updated_at: string;
  }
  
  const [dashboardData, setDashboardData] = useState({
    resumeCount: 0,
    coverLetterCount: 0,
    portfolioExists: false,
    portfolioPublic: false,
    username: '',
    latestResumes: [] as ResumeItem[],
    latestCoverLetters: [] as CoverLetterItem[]
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Fetch resumes
        const resumes = await ResumeService.getResumes(user.id);
        // Fetch cover letters
        const coverLetters = await CoverLetterService.getCoverLetters(user.id);
        // Fetch portfolio
        const portfolio = await PortfolioService.getPortfolio(user.id);
        
        setDashboardData({
          resumeCount: resumes.length,
          coverLetterCount: coverLetters.length,
          portfolioExists: !!portfolio,
          portfolioPublic: portfolio?.is_public || false,
          username: profile?.username || '',
          latestResumes: resumes.slice(0, 3),
          latestCoverLetters: coverLetters.slice(0, 3)
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user, profile]);

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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {subscriptionStatus === 'free' ? 'Free Plan' : 'Premium Plan'}
          </span>
          {subscriptionStatus === 'free' && (
            <Link to="/pricing">
              <Button variant="outline" size="sm">Upgrade</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.resumeCount}</div>
            <p className="text-xs text-muted-foreground">
              Documents created
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/resume" className="w-full">
              <Button variant="ghost" className="w-full">
                <FileText className="mr-2 h-4 w-4" /> View All
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.coverLetterCount}</div>
            <p className="text-xs text-muted-foreground">
              Documents created
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/cover-letter" className="w-full">
              <Button variant="ghost" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" /> View All
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Portfolio</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.portfolioPublic ? 'Public' : 'Private'}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.username ? `@${dashboardData.username}` : 'Create your public profile'}
            </p>
          </CardContent>
          <CardFooter>
            {dashboardData.portfolioPublic ? (
              <Link to={`/${dashboardData.username}`} target="_blank" className="w-full">
                <Button variant="ghost" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" /> View Public Profile
                </Button>
              </Link>
            ) : (
              <Link to="/dashboard/portfolio" className="w-full">
                <Button variant="ghost" className="w-full">
                  <User className="mr-2 h-4 w-4" /> Manage Portfolio
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Resumes</CardTitle>
              <Link to="/dashboard/resume/new">
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" /> New Resume
                </Button>
              </Link>
            </div>
            <CardDescription>
              Your recently created or updated resumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.latestResumes.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.latestResumes.map(resume => (
                  <Link 
                    key={resume.id} 
                    to={`/dashboard/resume/${resume.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 bg-card rounded-md border hover:border-primary transition-colors">
                      <div>
                        <h3 className="font-medium">{resume.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Updated {new Date(resume.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No resumes yet</p>
                <p className="text-xs text-muted-foreground">Create your first resume to get started</p>
              </div>
            )}
          </CardContent>
          {dashboardData.resumeCount > 3 && (
            <CardFooter>
              <Link to="/dashboard/resume" className="w-full">
                <Button variant="outline" className="w-full">View All Resumes</Button>
              </Link>
            </CardFooter>
          )}
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Cover Letters</CardTitle>
              <Link to="/dashboard/cover-letter/new">
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" /> New Cover Letter
                </Button>
              </Link>
            </div>
            <CardDescription>
              Your recently created or updated cover letters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.latestCoverLetters.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.latestCoverLetters.map(letter => (
                  <Link 
                    key={letter.id} 
                    to={`/dashboard/cover-letter/${letter.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 bg-card rounded-md border hover:border-primary transition-colors">
                      <div>
                        <h3 className="font-medium">{letter.job_title} at {letter.company}</h3>
                        <p className="text-sm text-muted-foreground">
                          Updated {new Date(letter.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No cover letters yet</p>
                <p className="text-xs text-muted-foreground">Create your first cover letter to get started</p>
              </div>
            )}
          </CardContent>
          {dashboardData.coverLetterCount > 3 && (
            <CardFooter>
              <Link to="/dashboard/cover-letter" className="w-full">
                <Button variant="outline" className="w-full">View All Cover Letters</Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}