
import React from 'react';
import { Card } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Calendar, Users } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Share Your Preferences",
      description: "Tell our AI about your travel style, interests, budget, and schedule.",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600",
      icon: <Lightbulb className="h-10 w-10 text-neo-blue" strokeWidth={3} />,
      rotation: -2
    },
    {
      number: "02",
      title: "Get Personalized Recommendations",
      description: "Our AI matches you with perfect destinations and generates custom itineraries.",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=600",
      icon: <Calendar className="h-10 w-10 text-neo-pink" strokeWidth={3} />,
      rotation: 0
    },
    {
      number: "03",
      title: "Book With Confidence",
      description: "Seamlessly book accommodations and activities with our trusted partners.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=600",
      icon: <Users className="h-10 w-10 text-neo-green" strokeWidth={3} />,
      rotation: 2
    }
  ];

  return (
    <section id="how-it-works" className="bg-neo-background py-20 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-neo-yellow px-6 py-3 rounded-lg border-3 border-black shadow-neo mb-6 transform -rotate-1">
            <h2 className="font-archivo text-3xl md:text-4xl font-black text-black m-0">How It Works</h2>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-black font-space-grotesk">
            Planning your dream vacation has never been easier. Our AI-powered platform helps you every step of the way.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector line - visible on desktop only */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-4 bg-black transform -translate-y-1/2 z-0 rounded-full"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10" style={{ transform: `rotate(${step.rotation}deg)` }}>
              {/* Image card */}
              <div className="overflow-hidden rounded-xl mb-12 border-5 border-black shadow-neo bg-white p-3 transform transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                <img 
                  src={step.image}
                  alt={step.title}
                  className="w-full h-56 object-cover border-3 border-black rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/600x400";
                  }}
                />
              </div>
              
              {/* Step number */}
              <div className="absolute -top-6 -left-6 bg-neo-blue text-white font-archivo text-2xl font-black w-16 h-16 rounded-full flex items-center justify-center border-3 border-black shadow-neo z-20">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="absolute -top-6 -right-6 bg-white w-16 h-16 rounded-full flex items-center justify-center border-3 border-black shadow-neo z-20">
                {step.icon}
              </div>
              
              {/* Content card */}
              <Card className="bg-white p-6 border-3 border-black rounded-xl shadow-neo transform transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                <h3 className="text-xl font-archivo font-black mb-3">{step.title}</h3>
                <p className="text-black font-space-grotesk mb-4">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-6">
                    <ArrowRight className="h-8 w-8 text-neo-blue" strokeWidth={3} />
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
        
        {/* Bottom action link */}
        <div className="mt-16 text-center">
          <a 
            href="#features" 
            className="inline-block bg-neo-green text-black font-archivo font-bold text-lg px-8 py-4 rounded-lg border-3 border-black shadow-neo transform transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
          >
            Discover All Features
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
