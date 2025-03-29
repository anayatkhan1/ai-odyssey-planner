
import React from 'react';
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-neo-pink py-20 relative">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      <div className="max-w-4xl mx-auto text-center px-6 relative">
        <div className="bg-white border-5 border-black rounded-xl p-8 shadow-neo-lg transform -rotate-1">
          <h2 className="text-3xl md:text-4xl font-archivo font-black mb-6">
            Ready to Transform Your <span className="text-neo-blue">Travel Experience?</span>
          </h2>
          <p className="text-xl text-black mb-8 font-space-grotesk">
            Join thousands of travelers who have discovered the perfect way to plan their trips. Start your journey today with Voyagent.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="border-3 border-black bg-neo-blue text-white shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform text-lg px-8 py-6 font-archivo">Start Planning For Free</Button>
            <Button variant="outline" className="border-3 border-black bg-neo-yellow text-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform text-lg px-8 py-6 font-archivo">
              Watch Demo
            </Button>
          </div>
          <p className="mt-6 text-black font-space-mono font-bold">
            No credit card required. Free 14-day trial on all paid plans.
          </p>
        </div>
        
        <div className="absolute -bottom-8 -right-8 bg-neo-green text-black border-3 border-black rounded-lg p-3 shadow-neo transform rotate-6">
          <span className="font-archivo font-black text-lg">Start Today!</span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
