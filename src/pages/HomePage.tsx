import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-white to-primary-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Land the interview. <span className="text-primary">Every time.</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Create ATS-optimized resumes and cover letters with AI in seconds.
                    Stand out from the crowd with professionally designed templates.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to={user ? "/dashboard" : "/signup"}>
                    <Button size="lg" className="bg-primary hover:bg-primary-600">
                      {user ? "Go to Dashboard" : "Start Free"}
                    </Button>
                  </Link>
                  <Link to="/templates">
                    <Button size="lg" variant="outline">
                      Browse Templates
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] overflow-hidden rounded-lg shadow-xl">
                  <img
                    src="https://placehold.co/600x400/7C3AED/FFFFFF/png?text=Resume+Preview"
                    alt="Resume Preview"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to land your dream job
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Landable.ai provides all the tools you need to create professional job application documents.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4 rounded-lg bg-card p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">ATS-Optimized Resumes</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI technology ensures your resume passes through applicant tracking systems and reaches hiring managers.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg bg-card p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Tailored Cover Letters</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Generate personalized cover letters with customizable tone to match each company's culture.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg bg-card p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.29 7 12 12 20.71 7"></polyline>
                    <line x1="12" y1="22" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Professional Templates</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose from our collection of professionally designed templates to showcase your skills.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg bg-card p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                    className="h-6 w-6 text-primary"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Public Portfolio</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Showcase your work and experience with a customizable public portfolio.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg bg-card p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                    <path d="M4.93 4.93l2.83 2.83"></path>
                    <path d="M16.24 16.24l2.83 2.83"></path>
                    <path d="M2 12h4"></path>
                    <path d="M18 12h4"></path>
                    <path d="M4.93 19.07l2.83-2.83"></path>
                    <path d="M16.24 7.76l2.83-2.83"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">AI-Powered Optimization</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Use our AI to optimize your content for maximum impact and relevance to each job.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg bg-card p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Export Options</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Download your documents as PDF, DOCX, or copy them directly to use in your applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Three simple steps to success
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our intuitive platform makes resume and cover letter creation seamless
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Choose a Template</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Browse our collection of professionally designed templates and select one that matches your style.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">Add Your Information</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Fill in your details or let our AI help you optimize your content for better impact.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Download & Apply</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Export your document in your preferred format and start applying with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Get started for free and upgrade when you need more
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 py-12 lg:grid-cols-2">
              {/* Free Tier */}
              <div className="flex flex-col justify-between rounded-lg border bg-card p-8 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold">Free</h3>
                  <div className="mt-4 text-4xl font-bold">$0</div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Forever free plan to get you started</p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>1 Export</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>2 AI Generations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>1 Public Profile</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Access to Basic Templates</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <Link to="/signup">
                    <Button className="w-full" variant="outline">Sign Up Free</Button>
                  </Link>
                </div>
              </div>
              
              {/* Premium Tier */}
              <div className="relative flex flex-col justify-between rounded-lg border bg-card p-8 shadow-sm">
                <div className="absolute -top-4 right-6 rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                  Popular
                </div>
                <div>
                  <h3 className="text-lg font-bold">Premium</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">$14.99</span>
                    <span className="ml-1 text-gray-500">/month</span>
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Everything you need for job applications</p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span className="font-semibold">Unlimited Exports</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span className="font-semibold">Unlimited AI Generations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Multiple Public Profiles</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Access to All Templates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Priority Customer Support</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <Link to="/pricing">
                    <Button className="w-full bg-primary hover:bg-primary-600">Choose Plan</Button>
                  </Link>
                  <p className="mt-2 text-xs text-center text-gray-500">
                    Or save 45% with our <Link to="/pricing" className="underline text-primary">yearly plan</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Loved by job seekers
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  See what our users say about their experience with Landable.ai
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <img
                      src="https://placehold.co/200x200/7C3AED/FFFFFF/png?text=JD"
                      alt="John Doe"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-base font-semibold">John Doe</p>
                    <p className="text-sm text-gray-500">Software Engineer</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">
                    "Landable.ai helped me optimize my resume and stand out in a competitive tech market. I received multiple callbacks after using it!"
                  </p>
                </div>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#7C3AED"
                      stroke="#7C3AED"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <img
                      src="https://placehold.co/200x200/7C3AED/FFFFFF/png?text=JS"
                      alt="Jane Smith"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-base font-semibold">Jane Smith</p>
                    <p className="text-sm text-gray-500">Marketing Manager</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">
                    "The AI-generated cover letters are amazing! They sound professional but still maintain my voice. I've recommended Landable.ai to all my friends."
                  </p>
                </div>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#7C3AED"
                      stroke="#7C3AED"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <img
                      src="https://placehold.co/200x200/7C3AED/FFFFFF/png?text=MT"
                      alt="Mike Thompson"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-base font-semibold">Mike Thompson</p>
                    <p className="text-sm text-gray-500">Recent Graduate</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">
                    "As a recent graduate with limited experience, I was struggling to create a resume. Landable.ai helped me highlight my skills and land my first job!"
                  </p>
                </div>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={i < 4 ? "#7C3AED" : "#E5E7EB"}
                      stroke={i < 4 ? "#7C3AED" : "#E5E7EB"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to land your next interview?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of job seekers who have boosted their careers with Landable.ai
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to={user ? "/dashboard" : "/signup"}>
                  <Button size="lg" className="bg-primary hover:bg-primary-600">
                    {user ? "Go to Dashboard" : "Get Started Free"}
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button size="lg" variant="outline">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}