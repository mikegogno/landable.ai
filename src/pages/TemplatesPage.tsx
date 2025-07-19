import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { TemplateService, TemplateData } from '@/lib/template';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TemplatesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'resume' | 'cover_letter'>('resume');
  const [resumeTemplates, setResumeTemplates] = useState<TemplateData[]>([]);
  const [coverLetterTemplates, setCoverLetterTemplates] = useState<TemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const [resumes, coverLetters] = await Promise.all([
          TemplateService.getResumeTemplates(),
          TemplateService.getCoverLetterTemplates()
        ]);
        
        setResumeTemplates(resumes);
        setCoverLetterTemplates(coverLetters);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplates();
  }, []);
  
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-br from-white to-primary-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Professional Templates
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose from our collection of carefully crafted templates designed to help you stand out
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="resume" className="w-full" onValueChange={(value) => setActiveTab(value as 'resume' | 'cover_letter')}>
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="resume">Resume Templates</TabsTrigger>
                  <TabsTrigger value="cover_letter">Cover Letter Templates</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="resume">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumeTemplates.map((template) => (
                      <Card key={template.id} className="overflow-hidden transition-all hover:shadow-lg">
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <img 
                            src={template.thumbnailUrl || `https://placehold.co/600x800/7C3AED/FFFFFF/png?text=${template.name}`}
                            alt={template.name}
                            className="object-cover w-full h-full"
                          />
                          {template.configuration?.primaryColor && (
                            <div 
                              className="absolute inset-0 opacity-10"
                              style={{ backgroundColor: template.configuration.primaryColor }}
                            ></div>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle>{template.name}</CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Link 
                            to={user ? `/dashboard/resume/new?template=${template.id}` : '/signup'}
                            className="w-full"
                          >
                            <Button className="w-full">
                              {user ? 'Use Template' : 'Sign Up to Use'}
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cover_letter">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coverLetterTemplates.map((template) => (
                      <Card key={template.id} className="overflow-hidden transition-all hover:shadow-lg">
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <img 
                            src={template.thumbnailUrl || `https://placehold.co/600x800/7C3AED/FFFFFF/png?text=${template.name}`}
                            alt={template.name}
                            className="object-cover w-full h-full"
                          />
                          {template.configuration?.primaryColor && (
                            <div 
                              className="absolute inset-0 opacity-10"
                              style={{ backgroundColor: template.configuration.primaryColor }}
                            ></div>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle>{template.name}</CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Link 
                            to={user ? `/dashboard/cover-letter/new?template=${template.id}` : '/signup'} 
                            className="w-full"
                          >
                            <Button className="w-full">
                              {user ? 'Use Template' : 'Sign Up to Use'}
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Premium Templates Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">
                  Premium Templates
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed mb-6">
                  Unlock all premium templates with a Landable.ai subscription and stand out from the competition.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 mr-2 text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    ATS-optimized formats
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 mr-2 text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Customizable color schemes
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 mr-2 text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Multiple layout options
                  </li>
                </ul>
                <Link to="/pricing">
                  <Button className="bg-primary hover:bg-primary-600">
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[400px]">
                  <img 
                    src="https://placehold.co/600x800/7C3AED/FFFFFF/png?text=Premium+Templates"
                    alt="Premium Templates Preview"
                    className="rounded-lg shadow-lg"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                    PREMIUM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Ready to create your professional resume?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose a template and start crafting your perfect resume today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to={user ? `/dashboard/resume/new?template=${activeTab === 'resume' ? resumeTemplates[0]?.id : ''}` : '/signup'}>
                  <Button size="lg" className="bg-primary hover:bg-primary-600">
                    {user ? 'Create Now' : 'Sign Up Free'}
                  </Button>
                </Link>
                {!user && (
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Log In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}