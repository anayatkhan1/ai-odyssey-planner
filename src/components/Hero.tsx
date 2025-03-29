import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plane, Info, Check } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-neo-background relative overflow-hidden">
      {/* Abstract shapes background */}
      <div className="absolute top-24 right-24 w-32 h-32 bg-neo-yellow rounded-full border-3 border-black z-0 animate-bounce-slow opacity-70"></div>
      <div className="absolute bottom-24 left-24 w-24 h-24 bg-neo-pink rounded-lg border-3 border-black z-0 rotate-12 animate-spin-slow opacity-70"></div>
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-neo-green rounded-lg border-3 border-black z-0 opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column: hero content */}
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-archivo font-black leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Plan Your Perfect Trip with AI
            </motion.h1>
            
            <motion.p 
              className="text-xl mb-8 text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Voyagent is your personal AI travel assistant that creates personalized itineraries based on your preferences, budget, and travel style.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/auth">
                <Button className="w-full sm:w-auto text-md bg-neo-blue text-white border-3 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">
                  <Plane className="mr-2 h-5 w-5" />
                  Start Planning Now
                </Button>
              </Link>
              
              <Link to="/#how-it-works">
                <Button variant="outline" className="w-full sm:w-auto text-md bg-white border-3 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">
                  <Info className="mr-2 h-5 w-5" />
                  How It Works
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-center gap-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Check className="text-neo-green h-5 w-5" />
              <span>No credit card required</span>
              <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
              <Check className="text-neo-green h-5 w-5" />
              <span>AI-powered recommendations</span>
              <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
              <Check className="text-neo-green h-5 w-5" />
              <span>Free plan available</span>
            </motion.div>
          </div>
          
          {/* Right column: hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-white p-4 border-5 border-black rounded-xl shadow-neo-xl transform rotate-2">
              <img 
                src="/src/assets/hero-image.jpg" 
                alt="Travel Planning" 
                className="w-full h-auto rounded-lg border-3 border-black"
              />
              
              <div className="absolute -bottom-6 -right-6 bg-white p-3 border-3 border-black rounded-lg shadow-neo transform -rotate-3">
                <div className="flex items-center gap-2">
                  <div className="bg-neo-green h-3 w-3 rounded-full"></div>
                  <div className="bg-neo-yellow h-3 w-3 rounded-full"></div>
                  <div className="bg-neo-pink h-3 w-3 rounded-full"></div>
                  <span className="text-sm font-bold">AI-powered suggestions</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
