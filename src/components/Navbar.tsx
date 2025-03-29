
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-travel-blue" />
          <span className="text-2xl font-bold text-travel-blue">Voyagent</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="font-medium hover:text-travel-blue transition-colors">Features</a>
          <a href="#how-it-works" className="font-medium hover:text-travel-blue transition-colors">How It Works</a>
          <a href="#pricing" className="font-medium hover:text-travel-blue transition-colors">Pricing</a>
          <a href="#testimonials" className="font-medium hover:text-travel-blue transition-colors">Testimonials</a>
        </div>

        <div className="flex items-center space-x-4">
          <Button className="bg-white text-travel-blue hover:bg-gray-100">Log in</Button>
          <Button className="bg-travel-blue text-white hover:bg-travel-blue/90">Sign up free</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
