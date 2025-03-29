
import React from 'react';
import { Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-travel-blue text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-6 w-6" />
              <span className="text-2xl font-bold">Voyagent</span>
            </div>
            <p className="text-travel-lightBlue mb-4">
              AI-powered travel planning that understands you and creates personalized experiences.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-travel-lightBlue hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-travel-lightBlue hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="text-travel-lightBlue hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-travel-lightBlue hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Travel Guides</a></li>
              <li><a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Destinations</a></li>
              <li><a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-travel-lightBlue hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-travel-blue/40 flex flex-col md:flex-row justify-between items-center">
          <div className="text-travel-lightBlue text-sm mb-4 md:mb-0">
            © 2023 Voyagent. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-travel-lightBlue hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
