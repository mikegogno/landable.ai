import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CoverLetterService } from '@/lib/cover-letter';
import { TemplateService } from '@/lib/template';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { toast } from 'sonner';
import { ArrowLeft, Save, Download, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

// For the MVP, we'll implement a simplified version of the cover letter builder

interface CoverLetterData {
  jobTitle: string;
  company: string;
  tone: 'casual' | 'formal' | 'confident';
  jobDescription?: string;
  content: string;
}

export default function CoverLetterBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get('template') || 'cl-modern-1'; // Default template
  
  const { user } = useAuth();
  const { incrementExportUsage, incrementAIUsage, canExport, canUseAI } = useSubscription();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    jobTitle: '',
    company: '',
    tone: 'formal',
    jobDescription: '',
    content: '',
  });

  useEffect(() => {
    const loadCoverLetter = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        if (id && id !== 'new') {
          // Load existing cover letter
          const data = await CoverLetterService.getCoverLetter(id);
          setCoverLetterData({
            jobTitle: data.job_title,
            company: data.company,
            tone: data.tone,
            jobDescription: data.job_description || '',
            content: data.content,
          });
        }
      } catch (error) {
        console.error('Error loading cover letter:', error);
        toast.error('Failed to load cover letter');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCoverLetter();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      if (!id || id === 'new') {
        // Create new cover letter
        const data = await CoverLetterService.createCoverLetter(user.id, {
          job_title: coverLetterData.jobTitle,
          company: coverLetterData.company,
          tone: coverLetterData.tone,
          job_description: coverLetterData.jobDescription || null,
          content: coverLetterData.content,
          template_id: templateId,
        });
        
        navigate(`/dashboard/cover-letter/${data.id}`);
        toast.success('Cover letter created successfully!');
      } else {
        // Update existing cover letter
        await CoverLetterService.updateCoverLetter(id, {
          job_title: coverLetterData.jobTitle,
          company: coverLetterData.company,
          tone: coverLetterData.tone,
          job_description: coverLetterData.jobDescription || null,
          content: coverLetterData.content,
        });
        
        toast.success('Cover letter saved successfully!');
      }
    } catch (error) {
      console.error('Error saving cover letter:', error);
      toast.error('Failed to save cover letter');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!canExport) {
      toast.error('You have reached your export limit. Please upgrade to export more cover letters.');
      navigate('/pricing');
      return;
    }
    
    try {
      // In a real implementation, this would generate and download a PDF/DOCX file
      toast.success('Cover letter downloaded successfully!');
      
      // Increment export usage
      await incrementExportUsage();
    } catch (error) {
      console.error('Error exporting cover letter:', error);
      toast.error('Failed to export cover letter');
    }
  };

  const handleGenerateContent = async () => {
    if (!canUseAI) {
      toast.error('You have reached your AI generation limit. Please upgrade to generate more content.');
      navigate('/pricing');
      return;
    }
    
    if (!coverLetterData.jobTitle || !coverLetterData.company) {
      toast.error('Please fill in the job title and company name first.');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // In a real implementation, this would call the AI service to generate content
      // const generatedContent = await CoverLetterService.generateContent(
      //   coverLetterData.jobTitle,
      //   coverLetterData.company,
      //   coverLetterData.tone,
      //   coverLetterData.jobDescription
      // );
      
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sampleContent = `Dear Hiring Manager,\n\nI am writing to express my interest in the ${coverLetterData.jobTitle} position at ${coverLetterData.company}. With my background and experience, I believe I would be a valuable addition to your team.\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can contribute to ${coverLetterData.company}.\n\nSincerely,\n[Your Name]`;
      
      setCoverLetterData({
        ...coverLetterData,
        content: sampleContent,
      });
      
      // Increment AI usage
      await incrementAIUsage();
      
      toast.success('Cover letter generated successfully!');
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/dashboard/cover-letter')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cover Letters
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cover Letter Editor */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{coverLetterData.jobTitle || 'New Cover Letter'}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    value={coverLetterData.jobTitle}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, jobTitle: e.target.value })}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={coverLetterData.company}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, company: e.target.value })}
                    placeholder="e.g. Acme Inc."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <RadioGroup
                  value={coverLetterData.tone}
                  onValueChange={(value) => setCoverLetterData({
                    ...coverLetterData,
                    tone: value as 'casual' | 'formal' | 'confident'
                  })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="tone-casual" />
                    <Label htmlFor="tone-casual">Casual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formal" id="tone-formal" />
                    <Label htmlFor="tone-formal">Formal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confident" id="tone-confident" />
                    <Label htmlFor="tone-confident">Confident</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description (Optional)</Label>
                <Textarea
                  id="job-description"
                  value={coverLetterData.jobDescription || ''}
                  onChange={(e) => setCoverLetterData({ ...coverLetterData, jobDescription: e.target.value })}
                  placeholder="Paste the job description here for better AI-generated content"
                  className="min-h-32"
                />
              </div>
              
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Cover Letter with AI'}
              </Button>
              
              <div className="space-y-2">
                <Label htmlFor="content">Cover Letter Content</Label>
                <Textarea
                  id="content"
                  value={coverLetterData.content}
                  onChange={(e) => setCoverLetterData({ ...coverLetterData, content: e.target.value })}
                  placeholder="Enter your cover letter content or generate it with AI"
                  className="min-h-64"
                />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right Column: Preview */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Cover Letter Preview</h3>
            <div className="bg-gray-100 rounded-md p-4 min-h-[500px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Preview will be displayed here.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  (Full preview available in production)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}