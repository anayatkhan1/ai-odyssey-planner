import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Menu, X, LogIn, Info, } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="text-sm font-bold text-gray-700 hover:text-neo-blue transition-colors">
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-black font-bold hover:bg-neo-yellow/20 rounded-lg"
    onClick={onClick}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-neo-blue text-white p-2 rounded-lg border-3 border-black shadow-neo transform transition-transform hover:rotate-6">
                <Plane size={24} className="animate-bounce-slow" />
              </div>
              <span className="text-2xl font-archivo font-black tracking-wider">Voyagent</span>
            </Link>
          </div>
          
          {/* Navigation Links - visible on large screens */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/#features">Features</NavLink>
            <NavLink to="/#how-it-works">How It Works</NavLink>
            <NavLink to="/#pricing">Pricing</NavLink>
            <NavLink to="/#faq">FAQ</NavLink>
            
            <div className="pl-6 border-l border-gray-300">
              <Link to="/auth">
                <Button className="bg-neo-green text-black border-3 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Button - visible on small screens */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative border-3 border-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - conditional rendering */}
      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-white border-b-3 border-t-3 border-black shadow-neo"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            <MobileNavLink to="/#features" onClick={() => setMobileMenuOpen(false)}>Features</MobileNavLink>
            <MobileNavLink to="/#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</MobileNavLink>
            <MobileNavLink to="/#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
            <MobileNavLink to="/#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</MobileNavLink>
            
            <div className="pt-2 mt-2 border-t border-gray-200">
              <Link 
                to="/auth" 
                className="block px-4 py-2 text-black font-bold hover:bg-neo-yellow/20 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
