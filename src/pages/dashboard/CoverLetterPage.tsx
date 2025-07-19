import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CoverLetterService } from '@/lib/cover-letter';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { MessageSquare, Plus, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CoverLetter {
  id: string;
  job_title: string;
  company: string;
  tone: string;
  created_at: string;
  updated_at: string;
}

export default function CoverLetterPage() {
  const { user } = useAuth();
  const { canExport } = useSubscription();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchCoverLetters = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await CoverLetterService.getCoverLetters(user.id);
        setCoverLetters(data);
      } catch (error) {
        console.error('Error fetching cover letters:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoverLetters();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cover letter?')) return;
    
    try {
      await CoverLetterService.deleteCoverLetter(id);
      setCoverLetters(coverLetters.filter(coverLetter => coverLetter.id !== id));
    } catch (error) {
      console.error('Error deleting cover letter:', error);
    }
  };

  const filteredCoverLetters = coverLetters.filter(letter => 
    letter.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Cover Letters</h1>
        <Link to="/dashboard/cover-letter/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center max-w-sm">
        <Search className="h-4 w-4 absolute ml-3 text-muted-foreground" />
        <Input
          placeholder="Search cover letters..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredCoverLetters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoverLetters.map(letter => (
            <Card key={letter.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="h-40 bg-gray-100 relative flex items-center justify-center">
                  <MessageSquare className="h-20 w-20 text-gray-300" />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleDelete(letter.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{letter.job_title}</CardTitle>
                <p className="text-sm mb-1">{letter.company}</p>
                <div className="flex items-center mt-2">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {letter.tone === 'casual' ? 'Casual' : 
                     letter.tone === 'formal' ? 'Formal' : 'Confident'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Link to={`/dashboard/cover-letter/${letter.id}`} className="w-full">
                  <Button variant="outline" className="w-full">Edit</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No Cover Letters Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first cover letter to introduce yourself to employers
          </p>
          <Link to="/dashboard/cover-letter/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Cover Letter
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}