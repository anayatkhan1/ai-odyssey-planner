
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, Play, Calendar } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CTASection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  
  const handleDemoClick = () => {
    toast({
      title: "Demo coming soon!",
      description: "Our product demo is being prepared. We'll notify you when it's ready.",
    });
  };

  return (
    <section className="bg-gradient-to-br from-neo-pink to-neo-pink/70 py-24 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-10 animate-pulse"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-neo-yellow rounded-full border-3 border-black opacity-50 animate-bounce-slow"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-neo-blue rounded-full border-3 border-black opacity-50 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-neo-green rounded-lg border-3 border-black opacity-50 rotate-12 animate-spin-slow"></div>
      
      <div className="max-w-5xl mx-auto text-center px-6 relative">
        <div 
          className={`bg-white border-5 border-black rounded-xl p-10 shadow-neo-lg transform transition-all duration-300 ${isHovered ? 'rotate-0 scale-105' : '-rotate-1'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Decorative stars */}
          <div className="absolute -top-6 -left-6 bg-neo-yellow text-black border-3 border-black rounded-full p-2 shadow-neo transform rotate-12">
            <Star className="h-5 w-5 fill-black" />
          </div>
          <div className="absolute -top-4 right-20 bg-neo-green text-black border-3 border-black rounded-full p-2 shadow-neo transform -rotate-12">
            <Star className="h-4 w-4 fill-black" />
          </div>

          <div className="bg-neo-blue/10 border-3 border-black rounded-xl p-4 mb-6 transform -rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neo-blue/5 to-neo-blue/20 z-0"></div>
            <h2 className="text-4xl md:text-5xl font-archivo font-black mb-2 relative z-10">
              Ready to Transform Your <br />
              <span className="relative inline-block">
                <span className="text-neo-blue">Travel Experience?</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 4C50 0 150 0 200 4" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
                <Sparkles className="absolute -right-8 -top-8 h-6 w-6 text-neo-pink" />
              </span>
            </h2>
          </div>
          
          <p className="text-xl text-black mb-8 font-space-grotesk max-w-2xl mx-auto relative">
            Join thousands of travelers who have discovered the perfect way to plan their trips. 
            Start your journey today with Voyagent and see why our users rate us 
            <span className="inline-flex items-center mx-1 bg-neo-yellow/20 px-2 py-1 rounded-lg border-2 border-black">
              <Star className="h-4 w-4 fill-neo-yellow text-neo-yellow mr-1" />
              <strong>4.9/5</strong>
            </span>
            stars!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-6">
            <Button 
              className="border-3 border-black bg-neo-blue text-white shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform text-lg px-8 py-7 font-archivo group overflow-hidden relative"
            >
              <span className="absolute inset-0 w-0 bg-black transition-all duration-300 group-hover:w-full opacity-10"></span>
              <span className="flex items-center relative z-10">
                Start Planning For Free
                <ArrowRight className="ml-2 h-5 w-5 transform transition-all duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-3 border-black bg-neo-yellow text-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform text-lg px-8 py-7 font-archivo group relative overflow-hidden"
              onClick={handleDemoClick}
            >
              <span className="absolute inset-0 w-0 bg-white transition-all duration-300 group-hover:w-full opacity-20"></span>
              <span className="flex items-center relative z-10">
                <Play className="mr-2 h-5 w-5 fill-black" />
                Watch Demo
              </span>
            </Button>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="bg-neo-green/10 rounded-full px-6 py-3 border-2 border-black">
              <p className="text-black font-space-mono font-bold flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-neo-green" />
                No credit card required. Free 14-day trial on all paid plans.
              </p>
            </div>
          </div>
          
          {/* Customer avatars */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center bg-white border-2 border-black rounded-full px-4 py-2 shadow-neo">
              <div className="flex -space-x-3 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-black overflow-hidden shadow-neo-sm transform hover:translate-y-1 hover:translate-x-1 hover:scale-110 hover:z-10 transition-all">
                    <img src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} alt="User" className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="font-space-grotesk text-sm">
                <strong>10,000+</strong> travelers already using Voyagent
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-8 -right-8 bg-neo-green text-black border-3 border-black rounded-lg p-3 shadow-neo transform rotate-6 animate-bounce-slow">
          <span className="font-archivo font-black text-lg flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Today!
          </span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
