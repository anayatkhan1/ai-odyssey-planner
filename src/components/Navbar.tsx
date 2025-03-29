
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Menu, X, ChevronRight, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const getInitials = (email: string | undefined) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  const navItems = ["Features", "How It Works", "Pricing", "Testimonials", "FAQ"];

  // Don't show navbar on login and signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const isAuthPage = location.pathname === '/travel' || location.pathname === '/app' || location.pathname === '/profile';

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
          <Link to="/" className="flex items-center space-x-2">
            <div className={`bg-neo-blue text-white p-2 rounded-lg border-3 border-black shadow-neo transition-transform hover:rotate-12 duration-300 ${
              isScrolled ? 'scale-90' : 'scale-100'
            }`}>
              <Globe className="h-6 w-6" strokeWidth={3} />
            </div>
            <span className={`text-2xl font-archivo font-black text-black transition-all duration-300 ${
              isScrolled ? 'scale-95' : 'scale-100'
            }`}>Voyagent</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isAuthPage && (
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
        )}

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full h-10 w-10 p-0 border-3 border-black hover:bg-neo-yellow/30 hover:text-black">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-neo-blue text-white">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border-3 border-black shadow-neo">
                <DropdownMenuItem className="hover:bg-neo-yellow/20 hover:text-black cursor-pointer" onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-neo-yellow/20 hover:text-black cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button className="font-archivo font-bold bg-white border-3 border-black text-black hover:bg-gray-100 hover:text-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform group">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="font-archivo font-bold bg-neo-blue border-3 border-black text-white hover:bg-neo-blue/90 hover:text-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform group">
                  Sign up free
                  <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            onClick={toggleMobileMenu}
            variant="ghost" 
            className="p-2 border-3 border-black rounded-lg shadow-neo bg-white hover:bg-neo-yellow/30 hover:text-black transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu with improved animation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-neo-background border-t-3 border-black z-50 overflow-y-auto animate-fade-in">
          <div className="flex flex-col p-6 space-y-5">
            {!isAuthPage && navItems.map((item, index) => (
              <a 
                key={index} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`font-archivo font-bold text-lg px-6 py-4 hover:bg-neo-yellow/20 hover:text-black rounded-lg border-3 border-black shadow-neo-sm hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-transform relative overflow-hidden group animate-fade-in`}
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
              {user ? (
                <>
                  <Button 
                    className="w-full font-archivo font-bold bg-white border-3 border-black text-black hover:bg-gray-100 hover:text-black shadow-neo hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-transform h-14 flex items-center justify-center"
                    onClick={() => {
                      navigate('/profile');
                      setMobileMenuOpen(false);
                      document.body.style.overflow = 'auto';
                    }}
                  >
                    <User className="mr-2" />
                    Profile
                  </Button>
                  <Button 
                    className="w-full font-archivo font-bold bg-neo-blue border-3 border-black text-white hover:bg-neo-blue/90 hover:text-black shadow-neo hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-transform h-14 flex items-center justify-center"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                      document.body.style.overflow = 'auto';
                    }}
                  >
                    <LogOut className="mr-2" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => {
                    setMobileMenuOpen(false);
                    document.body.style.overflow = 'auto';
                  }}>
                    <Button className="w-full font-archivo font-bold bg-white border-3 border-black text-black hover:bg-gray-100 hover:text-black shadow-neo hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-transform h-14">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => {
                    setMobileMenuOpen(false);
                    document.body.style.overflow = 'auto';
                  }}>
                    <Button className="w-full font-archivo font-bold bg-neo-blue border-3 border-black text-white hover:bg-neo-blue/90 hover:text-black shadow-neo hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-transform h-14 group">
                      Sign up free
                      <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
