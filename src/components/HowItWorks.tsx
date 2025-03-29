
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Share Your Preferences",
      description: "Tell our AI about your travel style, interests, budget, and schedule.",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600",
      rotation: -2
    },
    {
      number: "02",
      title: "Get Personalized Recommendations",
      description: "Our AI matches you with perfect destinations and generates custom itineraries.",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=600",
      rotation: 0
    },
    {
      number: "03",
      title: "Book With Confidence",
      description: "Seamlessly book accommodations and activities with our trusted partners.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=600",
      rotation: 2
    }
  ];

  return (
    <section id="how-it-works" className="section-container relative">
      <div className="text-center mb-16">
        <h2 className="section-heading">How It Works</h2>
        <p className="max-w-2xl mx-auto text-lg text-black font-space-grotesk">
          Planning your dream vacation has never been easier. Our AI-powered platform helps you every step of the way.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step, index) => (
          <div key={index} className="relative" style={{ transform: `rotate(${step.rotation}deg)` }}>
            <div className="overflow-hidden rounded-xl mb-6 border-5 border-black shadow-neo bg-white p-2">
              <img 
                src={step.image}
                alt={step.title}
                className="w-full h-56 object-cover border-3 border-black rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x400";
                }}
              />
            </div>
            <div className="absolute -top-6 -left-6 bg-neo-blue text-white font-archivo text-2xl font-black w-16 h-16 rounded-full flex items-center justify-center border-3 border-black shadow-neo">
              {step.number}
            </div>
            <div className="bg-white p-6 border-3 border-black rounded-xl shadow-neo">
              <h3 className="text-xl font-black font-archivo mb-2">{step.title}</h3>
              <p className="text-black font-space-grotesk">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Connector Lines */}
      <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-2 bg-black transform -translate-y-1/2 z-0"></div>
    </section>
  );
};

export default HowItWorks;
