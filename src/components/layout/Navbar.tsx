import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Templates', path: '/templates' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];
  
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-bold text-2xl text-primary">Landable</span>
            <span className="font-bold text-2xl">.ai</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Auth/Dashboard */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="py-2 px-4 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t mt-2 pt-4 space-y-2">
                {user ? (
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}