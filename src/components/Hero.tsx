
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-neo-background pt-28 pb-20 md:py-28">
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-neo-yellow rounded-full border-3 border-black z-0 animate-bounce-slow"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-neo-pink rounded-full border-3 border-black z-0 animate-pulse"></div>
      <div className="absolute top-40 left-20 w-12 h-12 bg-neo-mint rounded-lg border-3 border-black z-0 rotate-12 animate-spin-slow"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="inline-block bg-neo-yellow border-3 border-black px-4 py-1 rounded-lg shadow-neo-sm transform -rotate-2 mb-2">
              <span className="font-bold font-archivo flex items-center">
                <Sparkles size={18} className="mr-2" />
                AI-Powered Travel Planning
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-archivo font-black text-black leading-tight">
              Plan Your <span className="text-neo-blue relative inline-block">
                Perfect Trip
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 4C50 0 150 0 200 4" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </span> in Minutes, Not Hours
            </h1>
            
            <p className="text-xl text-black font-space-grotesk">
              AI-powered travel recommendations based on your preferences, budget, and schedule. Experience travel planning that's as enjoyable as the journey itself.
            </p>
            
            {/* Quick Action Cards */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-white border-3 border-black rounded-lg p-3 shadow-neo-sm flex items-center space-x-2 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <Calendar className="text-neo-blue" />
                <span className="font-bold">Instant Itineraries</span>
              </div>
              <div className="bg-white border-3 border-black rounded-lg p-3 shadow-neo-sm flex items-center space-x-2 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <MapPin className="text-neo-pink" />
                <span className="font-bold">Hidden Gems</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Button className="btn-primary text-lg group overflow-hidden relative">
                Start Planning For Free
                <span className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                  <ArrowRight />
                </span>
              </Button>
              <Button variant="outline" className="text-lg border-3 border-black bg-neo-yellow text-black hover:bg-neo-yellow/90 shadow-neo transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                How It Works
              </Button>
            </div>
            
            <div className="pt-4 text-black flex items-center font-space-grotesk">
              <div className="flex -space-x-3 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white border-3 border-black overflow-hidden shadow-neo-sm transform hover:translate-y-1 hover:translate-x-1 hover:scale-110 hover:z-10 transition-all">
                    <img src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} alt="User" className="object-cover" />
                  </div>
                ))}
              </div>
              <span className="bg-white px-3 py-1 rounded-full border-2 border-black shadow-neo-sm">
                <strong>10,000+</strong> happy travelers
              </span>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-neo-yellow rounded-full z-0 border-3 border-black"></div>
            
            <div className="relative z-10 rotate-3 border-5 border-black rounded-xl overflow-hidden shadow-neo-lg bg-white p-3 transform hover:rotate-0 transition-transform duration-300">
              <img 
                src="/src/assets/hero-image.jpg" 
                alt="Travel planning made easy" 
                className="w-full h-auto object-cover rounded-lg border-3 border-black"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800";
                }}
              />
              
              {/* Image overlay elements */}
              <div className="absolute top-5 left-5 bg-white border-3 border-black rounded-lg py-2 px-3 shadow-neo-sm transform -rotate-6">
                <span className="font-bold font-archivo">Rome, Italy</span>
              </div>
              
              <div className="absolute bottom-8 right-8 bg-white border-3 border-black rounded-lg py-2 px-3 shadow-neo-sm transform rotate-6">
                <span className="font-bold font-archivo">$1,299</span>
              </div>
            </div>
            
            <div className="absolute top-auto -bottom-8 -right-6 z-20 bg-neo-pink text-white font-bold py-3 px-6 rounded-lg border-3 border-black shadow-neo rotate-6 transform hover:-rotate-3 transition-transform">
              <span className="font-archivo text-lg flex items-center">
                <Sparkles className="mr-2" /> AI-Powered!
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
