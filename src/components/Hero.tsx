
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-travel-lightBlue">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-travel-blue">
              Plan Your Perfect Trip in Minutes, Not Hours
            </h1>
            <p className="text-xl text-gray-700">
              AI-powered travel recommendations based on your preferences, budget, and schedule. Experience travel planning that's as enjoyable as the journey itself.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Button className="btn-primary text-lg">Start Planning For Free</Button>
              <Button variant="outline" className="text-lg border-travel-blue text-travel-blue hover:bg-travel-blue/10">
                How It Works
              </Button>
            </div>
            <div className="pt-4 text-gray-600 flex items-center">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} alt="User" />
                  </div>
                ))}
              </div>
              <span>Trusted by 10,000+ travelers worldwide</span>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl animate-float">
              <img 
                src="/src/assets/hero-image.jpg" 
                alt="Travel planning made easy" 
                className="w-full h-auto object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800";
                }}
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-travel-orange/20 rounded-full z-0"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-travel-teal/20 rounded-full z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
