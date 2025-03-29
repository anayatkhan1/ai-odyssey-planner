
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";

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
  };

  const navItems = ["Features", "How It Works", "Pricing", "Testimonials", "FAQ"];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-neo-sm py-3' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`bg-neo-blue text-white p-2 rounded-lg border-3 border-black shadow-neo transition-transform hover:rotate-12 duration-300`}>
            <Globe className="h-6 w-6" strokeWidth={3} />
          </div>
          <span className="text-2xl font-archivo font-black text-black">Voyagent</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <a 
              key={index} 
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="font-archivo font-bold hover:text-neo-blue transition-colors px-3 py-1 hover:bg-neo-yellow/20 rounded relative group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-neo-blue transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button className="font-archivo font-bold bg-white border-3 border-black text-black hover:bg-gray-100 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">
            Log in
          </Button>
          <Button className="font-archivo font-bold bg-neo-blue border-3 border-black text-white hover:bg-neo-blue/90 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">
            Sign up free
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            onClick={toggleMobileMenu}
            variant="ghost" 
            className="p-2 border-3 border-black rounded-lg shadow-neo bg-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-3 border-black shadow-neo-lg">
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="font-archivo font-bold text-lg px-4 py-2 hover:bg-neo-yellow/20 rounded border-2 border-black shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-3 border-t-2 border-black">
              <Button className="font-archivo font-bold bg-white border-3 border-black text-black hover:bg-gray-100 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">
                Log in
              </Button>
              <Button className="font-archivo font-bold bg-neo-blue border-3 border-black text-white hover:bg-neo-blue/90 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">
                Sign up free
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
