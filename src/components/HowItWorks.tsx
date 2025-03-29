
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Share Your Preferences",
      description: "Tell our AI about your travel style, interests, budget, and schedule.",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600"
    },
    {
      number: "02",
      title: "Get Personalized Recommendations",
      description: "Our AI matches you with perfect destinations and generates custom itineraries.",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=600"
    },
    {
      number: "03",
      title: "Book With Confidence",
      description: "Seamlessly book accommodations and activities with our trusted partners.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=600"
    }
  ];

  return (
    <section id="how-it-works" className="section-container">
      <div className="text-center mb-16">
        <h2 className="section-heading">How It Works</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Planning your dream vacation has never been easier. Our AI-powered platform helps you every step of the way.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="overflow-hidden rounded-xl mb-6">
              <img 
                src={step.image}
                alt={step.title}
                className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x400";
                }}
              />
            </div>
            <div className="absolute -top-4 -left-4 bg-travel-orange text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center">
              {step.number}
            </div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
