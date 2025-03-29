
import React from 'react';
import { Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neo-black text-white pt-16 pb-8 border-t-5 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-neo-blue p-2 rounded-lg border-3 border-black">
                <Globe className="h-6 w-6" strokeWidth={3} />
              </div>
              <span className="text-2xl font-archivo font-black">Voyagent</span>
            </div>
            <p className="text-gray-300 mb-4 font-space-grotesk">
              AI-powered travel planning that understands you and creates personalized experiences.
            </p>
          </div>
          
          <div>
            <h3 className="font-archivo font-black text-lg mb-4 border-b-3 border-neo-blue pb-2">Product</h3>
            <ul className="space-y-2 font-space-grotesk">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors hover:underline">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors hover:underline">How It Works</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors hover:underline">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-archivo font-black text-lg mb-4 border-b-3 border-neo-pink pb-2">Resources</h3>
            <ul className="space-y-2 font-space-grotesk">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Travel Guides</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Destinations</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-archivo font-black text-lg mb-4 border-b-3 border-neo-yellow pb-2">Company</h3>
            <ul className="space-y-2 font-space-grotesk">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Press</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0 font-space-mono">
            © 2023 Voyagent. All rights reserved.
          </div>
          
          <div className="flex space-x-6 font-space-grotesk">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
