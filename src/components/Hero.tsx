
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-neo-background">
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-archivo font-black text-black">
              Plan Your <span className="text-neo-blue">Perfect Trip</span> in Minutes, Not Hours
            </h1>
            <p className="text-xl text-black font-space-grotesk">
              AI-powered travel recommendations based on your preferences, budget, and schedule. Experience travel planning that's as enjoyable as the journey itself.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Button className="btn-primary text-lg">Start Planning For Free</Button>
              <Button variant="outline" className="text-lg border-3 border-black bg-neo-yellow text-black hover:bg-neo-yellow/90 shadow-neo transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                How It Works
              </Button>
            </div>
            <div className="pt-4 text-black flex items-center font-space-grotesk">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-black overflow-hidden">
                    <img src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} alt="User" />
                  </div>
                ))}
              </div>
              <span>Trusted by 10,000+ travelers worldwide</span>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-neo-yellow rounded-full z-0 border-3 border-black"></div>
            
            <div className="relative z-10 rotate-3 border-5 border-black rounded-xl overflow-hidden shadow-neo-lg bg-white p-2">
              <img 
                src="/src/assets/hero-image.jpg" 
                alt="Travel planning made easy" 
                className="w-full h-auto object-cover rounded-lg border-3 border-black"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800";
                }}
              />
            </div>
            
            <div className="absolute top-auto -bottom-8 -right-6 z-20 bg-neo-pink text-white font-bold py-2 px-4 rounded-lg border-3 border-black shadow-neo rotate-6">
              <span className="font-archivo text-lg">AI-Powered!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
