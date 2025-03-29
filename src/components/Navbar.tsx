
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Menu, X, ChevronRight } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent scrolling when mobile menu is open
    document.body.style.overflow = mobileMenuOpen ? 'auto' : 'hidden';
  };

  // Clean up effect to reset overflow when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const navItems = ["Features", "How It Works", "Pricing", "Testimonials", "FAQ"];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-neo-sm py-3 border-b-3 border-black' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`bg-neo-blue text-white p-2 rounded-lg border-3 border-black shadow-neo transition-transform hover:rotate-12 duration-300 ${
            isScrolled ? 'scale-90' : 'scale-100'
          }`}>
            <Globe className="h-6 w-6" strokeWidth={3} />
          </div>
          <span className={`text-2xl font-archivo font-black text-black transition-all duration-300 ${
            isScrolled ? 'scale-95' : 'scale-100'
          }`}>Voyagent</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <a 
              key={index} 
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="font-archivo font-bold hover:text-neo-blue transition-colors px-3 py-1 hover:bg-neo-yellow/20 rounded relative group overflow-hidden"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-neo-blue transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button className="font-archivo font-bold bg-white border-3 border-black text-black hover:bg-gray-100 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform group">
            Log in
          </Button>
          <Button className="font-archivo font-bold bg-neo-blue border-3 border-black text-white hover:bg-neo-blue/90 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform group">
            Sign up free
            <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            onClick={toggleMobileMenu}
            variant="ghost" 
            className="p-2 border-3 border-black rounded-lg shadow-neo bg-white hover:bg-neo-yellow/30 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu with improved animation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-neo-background border-t-3 border-black z-50 overflow-y-auto animate-fade-in">
          <div className="flex flex-col p-6 space-y-5">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`font-archivo font-bold text-lg px-6 py-4 hover:bg-neo-yellow/20 rounded-lg border-3 border-black shadow-neo-sm hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-transform relative overflow-hidden group animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.body.style.overflow = 'auto';
                }}
              >
                {item}
                <ChevronRight className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            ))}
            <div className="pt-6 flex flex-col space-y-4 border-t-3 border-black animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button className="font-archivo font-bold bg-white border-3 border-black text-black hover:bg-gray-100 shadow-neo hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-transform h-14">
                Log in
              </Button>
              <Button className="font-archivo font-bold bg-neo-blue border-3 border-black text-white hover:bg-neo-blue/90 shadow-neo hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-transform h-14 group">
                Sign up free
                <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
