
import React from 'react';
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-travel-orange/10 py-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Travel Experience?
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Join thousands of travelers who have discovered the perfect way to plan their trips. Start your journey today with Voyagent.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button className="btn-primary text-lg px-8">Start Planning For Free</Button>
          <Button variant="outline" className="border-travel-blue text-travel-blue hover:bg-travel-blue/10 text-lg">
            Watch Demo
          </Button>
        </div>
        <p className="mt-6 text-gray-600">
          No credit card required. Free 14-day trial on all paid plans.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
