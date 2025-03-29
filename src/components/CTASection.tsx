import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plane } from 'lucide-react';

const CTASection = () => {
  return (
    <section id="cta" className="bg-neo-blue py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-12 right-12 w-24 h-24 bg-neo-yellow rounded-full border-3 border-black opacity-50"></div>
        <div className="absolute bottom-24 left-36 w-16 h-16 bg-neo-pink rounded-lg border-3 border-black rotate-12 opacity-50"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white border-5 border-black rounded-2xl overflow-hidden shadow-neo-xl">
          <div className="grid md:grid-cols-2">
            {/* Left Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-archivo font-black mb-6">
                Ready to Plan Your Next Adventure?
              </h2>
              
              <p className="text-lg mb-8">
                Sign up today and let our AI travel assistant help you create the perfect itinerary for your next trip!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button className="w-full sm:w-auto text-md bg-neo-blue text-white border-3 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform">
                    <Plane className="mr-2 h-5 w-5" />
                    Start Planning Now
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative h-64 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90"></div>
              <img 
                src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Travel Planning" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <h3 className="text-2xl md:text-3xl font-archivo font-black mb-2">Voyagent AI</h3>
                  <p className="text-white/80">Your personal travel companion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-white">
          <p>Join thousands of travelers who have discovered their perfect trip with Voyagent</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
