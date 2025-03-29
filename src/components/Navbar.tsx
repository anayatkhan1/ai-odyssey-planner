
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white py-4 px-6 border-b-5 border-black">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-neo-blue text-white p-2 rounded-lg border-3 border-black shadow-neo">
            <Globe className="h-6 w-6" strokeWidth={3} />
          </div>
          <span className="text-2xl font-archivo font-black text-black">Voyagent</span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {["Features", "How It Works", "Pricing", "Testimonials"].map((item, index) => (
            <a 
              key={index} 
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="font-archivo font-bold hover:text-neo-blue transition-colors px-3 py-1 hover:bg-neo-yellow/20 rounded"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Button className="font-archivo font-bold bg-white border-3 border-black text-black hover:bg-gray-100 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">Log in</Button>
          <Button className="font-archivo font-bold bg-neo-blue border-3 border-black text-white hover:bg-neo-blue/90 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">Sign up free</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
