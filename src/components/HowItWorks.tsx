
import React from 'react';
import { Card } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Calendar, Users, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Share Your Preferences",
      description: "Tell our AI about your travel style, interests, budget, and schedule.",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600",
      icon: <Lightbulb className="h-10 w-10 text-neo-blue" strokeWidth={3} />,
      rotation: -2,
      bgColor: "bg-neo-yellow"
    },
    {
      number: "02",
      title: "Get Personalized Recommendations",
      description: "Our AI matches you with perfect destinations and generates custom itineraries.",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=600",
      icon: <Calendar className="h-10 w-10 text-neo-pink" strokeWidth={3} />,
      rotation: 0,
      bgColor: "bg-neo-green"
    },
    {
      number: "03",
      title: "Book With Confidence",
      description: "Seamlessly book accommodations and activities with our trusted partners.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=600",
      icon: <Users className="h-10 w-10 text-neo-green" strokeWidth={3} />,
      rotation: 2,
      bgColor: "bg-neo-pink"
    }
  ];

  return (
    <section id="how-it-works" className="bg-neo-background py-20 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-neo-blue rounded-full border-3 border-black z-0 animate-bounce-slow"></div>
      <div className="absolute bottom-40 right-10 w-20 h-20 bg-neo-yellow rounded-lg border-3 border-black z-0 rotate-12 animate-spin-slow"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-white px-8 py-6 rounded-xl border-5 border-black shadow-neo-lg mb-6 relative">
            <Sparkles className="absolute -top-6 -right-6 h-10 w-10 text-white bg-neo-pink p-2 rounded-full border-3 border-black" />
            <h2 className="font-archivo text-3xl md:text-4xl font-black text-black m-0">
              <span className="text-neo-blue">How It </span>
              <span className="relative">
                Works
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path d="M0,5 Q50,15 100,5" stroke="#FFD100" strokeWidth="5" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-black font-space-grotesk">
              Planning your dream vacation has never been easier. Our AI-powered platform helps you every step of the way.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector line - visible on desktop only */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-4 bg-black transform -translate-y-1/2 z-0 rounded-full"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10" style={{ transform: `rotate(${step.rotation}deg)` }}>
              {/* Image card */}
              <div className="overflow-hidden rounded-xl mb-12 border-5 border-black shadow-neo bg-white p-3 transform transition-all duration-300 hover:-translate-y-2 hover:rotate-0">
                <div className="relative">
                  <img 
                    src={step.image}
                    alt={step.title}
                    className="w-full h-56 object-cover border-3 border-black rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/600x400";
                    }}
                  />
                  <div className={`absolute bottom-3 right-3 ${step.bgColor} px-4 py-2 rounded-lg border-3 border-black font-archivo font-bold text-black`}>
                    Step {step.number.split('0')[1]}
                  </div>
                </div>
              </div>
              
              {/* Step number */}
              <div className="absolute -top-6 -left-6 bg-neo-blue text-white font-archivo text-2xl font-black w-16 h-16 rounded-full flex items-center justify-center border-3 border-black shadow-neo z-20 transform transition-transform hover:scale-110">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className={`absolute -top-6 -right-6 ${step.bgColor} w-16 h-16 rounded-full flex items-center justify-center border-3 border-black shadow-neo z-20 transform transition-transform hover:rotate-12`}>
                {step.icon}
              </div>
              
              {/* Content card */}
              <Card className={`${step.bgColor} p-6 border-3 border-black rounded-xl shadow-neo transform transition-all duration-300 hover:-translate-y-2 hover:translate-x-1 hover:shadow-none`}>
                <h3 className="text-2xl font-archivo font-black mb-3">{step.title}</h3>
                <p className="text-black font-space-grotesk mb-4">{step.description}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="inline-block bg-white px-3 py-1 rounded-full border-2 border-black text-sm font-archivo font-bold">
                    {index === 0 ? "First Step" : index === 1 ? "Second Step" : "Final Step"}
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="md:hidden">
                      <ArrowRight className="h-8 w-8 text-black" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Bottom action link */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white p-4 rounded-xl border-3 border-black shadow-neo animate-bounce-slow">
            <Button 
              className="bg-neo-green text-black font-archivo font-bold text-lg px-8 py-6 rounded-lg border-3 border-black shadow-neo transform transition-all duration-300 hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
            >
              <span className="flex items-center gap-2">
                Start Your Journey <Compass className="ml-2 w-5 h-5" /> 
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
