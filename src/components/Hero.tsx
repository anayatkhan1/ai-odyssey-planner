
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Sparkles, Globe, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-neo-background pt-32 pb-20 md:pt-36 md:pb-28">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-neo-yellow rounded-full border-3 border-black z-0 animate-bounce-slow"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-neo-pink rounded-full border-3 border-black z-0 animate-pulse"></div>
      <div className="absolute top-40 left-20 w-12 h-12 bg-neo-mint rounded-lg border-3 border-black z-0 rotate-12 animate-spin-slow"></div>
      <div className="absolute bottom-32 right-24 w-14 h-14 bg-neo-green rounded-lg border-3 border-black z-0 -rotate-12 animate-bounce-slow" style={{ animationDelay: "1.5s" }}></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="inline-block bg-neo-yellow border-3 border-black px-4 py-1 rounded-lg shadow-neo-sm transform -rotate-2 mb-4">
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
            
            <p className="text-xl text-black font-space-grotesk max-w-lg">
              Our AI travel assistant analyzes millions of data points to create personalized itineraries based on your preferences, budget, and schedule. Experience travel planning that's as enjoyable as the journey itself.
            </p>
            
            {/* Quick Action Cards */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-white border-3 border-black rounded-lg p-3 shadow-neo-sm flex items-center space-x-2 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                <div className="bg-neo-blue rounded-full p-1.5">
                  <Calendar className="text-white h-4 w-4" />
                </div>
                <span className="font-bold">Instant Itineraries</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <div className="bg-white border-3 border-black rounded-lg p-3 shadow-neo-sm flex items-center space-x-2 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                <div className="bg-neo-pink rounded-full p-1.5">
                  <MapPin className="text-white h-4 w-4" />
                </div>
                <span className="font-bold">Hidden Gems</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <div className="bg-white border-3 border-black rounded-lg p-3 shadow-neo-sm flex items-center space-x-2 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                <div className="bg-neo-green rounded-full p-1.5">
                  <Globe className="text-white h-4 w-4" />
                </div>
                <span className="font-bold">Global Destinations</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
              <Button className="btn-primary text-lg group overflow-hidden relative h-14">
                <span className="flex items-center">
                  Start Planning For Free
                  <span className="ml-2 opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    <ArrowRight />
                  </span>
                </span>
              </Button>
              <Button variant="outline" className="text-lg border-3 border-black bg-neo-yellow text-black hover:bg-neo-yellow/90 shadow-neo transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none h-14 group">
                <span className="flex items-center">
                  How It Works
                  <span className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    <ArrowRight />
                  </span>
                </span>
              </Button>
            </div>
            
            <div className="pt-6 text-black flex items-center font-space-grotesk">
              <div className="flex -space-x-3 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white border-3 border-black overflow-hidden shadow-neo-sm transform hover:translate-y-1 hover:translate-x-1 hover:scale-110 hover:z-10 transition-all">
                    <img src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} alt="User" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex items-center bg-white px-3 py-1 rounded-full border-2 border-black shadow-neo-sm">
                <strong>10,000+</strong> 
                <span className="mx-1">happy travelers</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-neo-yellow text-neo-yellow" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-neo-yellow rounded-full z-0 border-3 border-black"></div>
            
            <div className="relative z-10 rotate-3 border-5 border-black rounded-xl overflow-hidden shadow-neo-lg bg-white p-3 transform hover:rotate-0 transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800" 
                alt="Travel planning made easy" 
                className="w-full h-auto object-cover rounded-lg border-3 border-black"
              />
              
              {/* Interactive image overlay elements */}
              <div className="absolute top-5 left-5 bg-white border-3 border-black rounded-lg py-2 px-3 shadow-neo-sm transform -rotate-6 hover:rotate-0 transition-transform">
                <span className="font-bold font-archivo flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-neo-pink" />
                  Rome, Italy
                </span>
              </div>
              
              <div className="absolute bottom-8 right-8 bg-white border-3 border-black rounded-lg py-2 px-3 shadow-neo-sm transform rotate-6 hover:rotate-0 transition-transform">
                <span className="font-bold font-archivo">$1,299</span>
              </div>

              {/* Trip duration badge */}
              <div className="absolute top-auto -bottom-4 left-12 z-20 bg-neo-green text-black font-bold py-2 px-4 rounded-lg border-3 border-black shadow-neo rotate-6 transform hover:-rotate-3 transition-transform">
                <span className="font-archivo text-sm flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> 7 Days
                </span>
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
