import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-16 text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">Page not found</h2>
        <p className="mt-4 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}