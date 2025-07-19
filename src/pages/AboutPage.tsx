import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-white to-primary-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  About Landable.ai
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our mission is to help job seekers land interviews with powerful AI tools
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Story</h2>
                <div className="space-y-4 text-gray-500 dark:text-gray-400">
                  <p>
                    Landable.ai was founded in 2024 with a simple goal: make the job application process less frustrating and more effective.
                  </p>
                  <p>
                    After witnessing countless friends and colleagues struggle with resume formatting, ATS optimization, and personalized cover letters, we knew there had to be a better way.
                  </p>
                  <p>
                    By combining the latest in AI technology with beautiful, professional designs, we've created a platform that helps job seekers put their best foot forward in a competitive job market.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] overflow-hidden rounded-lg">
                  <img
                    src="https://placehold.co/600x400/7C3AED/FFFFFF/png?text=Our+Story"
                    alt="Team working together"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Values</h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  These core principles guide everything we do
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
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
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                    <path d="M12 16h3.5a3.5 3.5 0 1 1 0 7H12v-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Innovation</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We continuously improve our AI technology to deliver the most effective job application documents.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
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
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Accessibility</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We believe everyone deserves access to tools that help them present themselves professionally.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
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
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M20 7h-9" />
                    <path d="M14 17H5" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Balance</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We strike the perfect balance between AI-powered efficiency and human creativity in document creation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Team</h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  The people behind Landable.ai
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <img
                    src="https://placehold.co/400x400/7C3AED/FFFFFF/png?text=JD"
                    alt="John Doe"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">John Doe</h3>
                  <p className="text-primary">Founder & CEO</p>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Former recruiter with 10+ years experience in talent acquisition.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <img
                    src="https://placehold.co/400x400/7C3AED/FFFFFF/png?text=JS"
                    alt="Jane Smith"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Jane Smith</h3>
                  <p className="text-primary">CTO</p>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  AI researcher with a background in natural language processing.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <img
                    src="https://placehold.co/400x400/7C3AED/FFFFFF/png?text=MJ"
                    alt="Michael Johnson"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Michael Johnson</h3>
                  <p className="text-primary">Design Director</p>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Award-winning designer with expertise in document layouts and typography.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
                <Link to="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary-600">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button size="lg" variant="outline">
                    Explore Templates
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