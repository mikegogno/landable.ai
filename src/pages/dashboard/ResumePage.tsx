import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeService } from '@/lib/resume';
import { TemplateService } from '@/lib/template';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { FileText, Plus, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Resume {
  id: string;
  title: string;
  template_id: string;
  created_at: string;
  updated_at: string;
}

export default function ResumePage() {
  const { user } = useAuth();
  const { canExport } = useSubscription();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchResumes = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await ResumeService.getResumes(user.id);
        setResumes(data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResumes();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await ResumeService.deleteResume(id);
      setResumes(resumes.filter(resume => resume.id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const filteredResumes = resumes.filter(resume => 
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
        <Link to="/dashboard/resume/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center max-w-sm">
        <Search className="h-4 w-4 absolute ml-3 text-muted-foreground" />
        <Input
          placeholder="Search resumes..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map(resume => (
            <Card key={resume.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="h-40 bg-gray-100 relative flex items-center justify-center">
                  <FileText className="h-20 w-20 text-gray-300" />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleDelete(resume.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{resume.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Link to={`/dashboard/resume/${resume.id}`} className="w-full">
                  <Button variant="outline" className="w-full">Edit</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No Resumes Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first resume to get started with your job search
          </p>
          <Link to="/dashboard/resume/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Resume
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}