import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ResumeService, ResumeData } from '@/lib/resume';
import { TemplateService } from '@/lib/template';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { toast } from 'sonner';
import { ArrowLeft, Save, Download, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// For the MVP, we'll implement a simplified version of the resume builder

export default function ResumeBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get('template') || 'modern-1'; // Default template
  
  const { user } = useAuth();
  const { incrementExportUsage, canExport } = useSubscription();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [resumeData, setResumeData] = useState<ResumeData>({
    title: 'Untitled Resume',
    templateId: templateId,
    content: {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
      },
      summary: '',
      experience: [
        {
          title: '',
          company: '',
          duration: '',
          bullets: [''],
        },
      ],
      education: [
        {
          degree: '',
          school: '',
          year: '',
        },
      ],
      skills: [''],
    },
  });

  useEffect(() => {
    const loadResume = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        if (id && id !== 'new') {
          // Load existing resume
          const data = await ResumeService.getResume(id);
          setResumeData({
            title: data.title,
            templateId: data.template_id,
            jobDescription: data.job_description,
            content: data.content,
          });
        }
      } catch (error) {
        console.error('Error loading resume:', error);
        toast.error('Failed to load resume');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResume();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      if (!id || id === 'new') {
        // Create new resume
        const newResume = await ResumeService.createResume(user.id, resumeData);
        navigate(`/dashboard/resume/${newResume.id}`);
        toast.success('Resume created successfully!');
      } else {
        // Update existing resume
        await ResumeService.updateResume(id, resumeData);
        toast.success('Resume saved successfully!');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!canExport) {
      toast.error('You have reached your export limit. Please upgrade to export more resumes.');
      navigate('/pricing');
      return;
    }
    
    try {
      // In a real implementation, this would generate and download a PDF/DOCX file
      toast.success('Resume downloaded successfully!');
      
      // Increment export usage
      await incrementExportUsage();
    } catch (error) {
      console.error('Error exporting resume:', error);
      toast.error('Failed to export resume');
    }
  };

  const handleOptimize = async () => {
    try {
      toast.success('Resume optimized for ATS!');
      // In a real implementation, this would use AI to optimize the resume
      // const optimizedContent = await ResumeService.optimizeForATS(resumeData.content);
      // setResumeData({ ...resumeData, content: optimizedContent });
    } catch (error) {
      console.error('Error optimizing resume:', error);
      toast.error('Failed to optimize resume');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Update personal info fields
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      content: {
        ...resumeData.content,
        personalInfo: {
          ...resumeData.content.personalInfo,
          [field]: value,
        },
      },
    });
  };

  // Add/update experience
  const updateExperience = (index: number, field: string, value: string | string[]) => {
    const newExperience = [...resumeData.content.experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value,
    };
    
    setResumeData({
      ...resumeData,
      content: {
        ...resumeData.content,
        experience: newExperience,
      },
    });
  };

  // Add/update education
  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...resumeData.content.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value,
    };
    
    setResumeData({
      ...resumeData,
      content: {
        ...resumeData.content,
        education: newEducation,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/dashboard/resume')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resumes
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleOptimize}>
            <Sparkles className="mr-2 h-4 w-4" /> Optimize for ATS
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Resume Editor */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Input
              className="text-2xl font-bold border-none px-0 mb-6 focus-visible:ring-0"
              value={resumeData.title}
              onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <h3 className="text-lg font-medium mt-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={resumeData.content.personalInfo.name}
                      onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.content.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.content.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={resumeData.content.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Professional Summary</h3>
                <div>
                  <textarea
                    className="w-full min-h-32 p-3 border rounded-md"
                    value={resumeData.content.summary}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      content: {
                        ...resumeData.content,
                        summary: e.target.value,
                      },
                    })}
                    placeholder="Write a brief summary of your professional background and skills..."
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="space-y-6">
                <h3 className="text-lg font-medium mt-4">Work Experience</h3>
                
                {resumeData.content.experience.map((exp, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`job-title-${index}`}>Job Title</Label>
                        <Input
                          id={`job-title-${index}`}
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`company-${index}`}>Company</Label>
                        <Input
                          id={`company-${index}`}
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`duration-${index}`}>Duration</Label>
                      <Input
                        id={`duration-${index}`}
                        placeholder="e.g. Jan 2020 - Present"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`bullets-${index}`}>Bullet Points</Label>
                      <textarea
                        id={`bullets-${index}`}
                        className="w-full min-h-32 p-3 border rounded-md"
                        value={exp.bullets.join('\n')}
                        onChange={(e) => updateExperience(
                          index,
                          'bullets',
                          e.target.value.split('\n').filter(bullet => bullet.trim() !== '')
                        )}
                        placeholder="Enter achievement bullet points (one per line)"
                      />
                    </div>
                    
                    {index > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newExperience = [...resumeData.content.experience];
                          newExperience.splice(index, 1);
                          setResumeData({
                            ...resumeData,
                            content: {
                              ...resumeData.content,
                              experience: newExperience,
                            },
                          });
                        }}
                      >
                        Remove Experience
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const newExperience = [...resumeData.content.experience];
                    newExperience.push({
                      title: '',
                      company: '',
                      duration: '',
                      bullets: [''],
                    });
                    setResumeData({
                      ...resumeData,
                      content: {
                        ...resumeData.content,
                        experience: newExperience,
                      },
                    });
                  }}
                >
                  Add Experience
                </Button>
              </TabsContent>
              
              <TabsContent value="education" className="space-y-6">
                <h3 className="text-lg font-medium mt-4">Education</h3>
                
                {resumeData.content.education.map((edu, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div>
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="e.g. Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`school-${index}`}>School</Label>
                      <Input
                        id={`school-${index}`}
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                        placeholder="e.g. University of California, Berkeley"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`year-${index}`}>Year</Label>
                      <Input
                        id={`year-${index}`}
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        placeholder="e.g. 2018 - 2022"
                      />
                    </div>
                    
                    {index > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newEducation = [...resumeData.content.education];
                          newEducation.splice(index, 1);
                          setResumeData({
                            ...resumeData,
                            content: {
                              ...resumeData.content,
                              education: newEducation,
                            },
                          });
                        }}
                      >
                        Remove Education
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const newEducation = [...resumeData.content.education];
                    newEducation.push({
                      degree: '',
                      school: '',
                      year: '',
                    });
                    setResumeData({
                      ...resumeData,
                      content: {
                        ...resumeData.content,
                        education: newEducation,
                      },
                    });
                  }}
                >
                  Add Education
                </Button>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4">
                <h3 className="text-lg font-medium mt-4">Skills</h3>
                <div>
                  <Label htmlFor="skills">Skills (one per line)</Label>
                  <textarea
                    id="skills"
                    className="w-full min-h-40 p-3 border rounded-md"
                    value={resumeData.content.skills.join('\n')}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      content: {
                        ...resumeData.content,
                        skills: e.target.value.split('\n').filter(skill => skill.trim() !== ''),
                      },
                    })}
                    placeholder="Enter skills, one per line (e.g. JavaScript, React, Project Management)"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Right Column: Preview */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Resume Preview</h3>
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