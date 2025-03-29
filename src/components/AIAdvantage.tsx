
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

const AIAdvantage = () => {
  const advantages = [
    {
      title: "87% More Personalized",
      description: "Our AI analyzes your preferences to create truly personalized recommendations.",
      change: "increase"
    },
    {
      title: "73% Time Saved",
      description: "Reduce your travel planning time from hours to minutes.",
      change: "decrease"
    },
    {
      title: "94% Customer Satisfaction",
      description: "Travelers rate their experience with our AI recommendations.",
      change: "increase"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-travel-blue to-travel-blue/80 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-white">The AI Advantage</h2>
          <p className="max-w-2xl mx-auto text-lg text-travel-lightBlue">
            Our advanced AI technology creates superior travel experiences compared to traditional methods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="flex items-center mb-4">
                {advantage.change === "increase" ? (
                  <ArrowUp className="h-8 w-8 text-travel-orange mr-2" />
                ) : (
                  <ArrowDown className="h-8 w-8 text-travel-orange mr-2" />
                )}
                <h3 className="text-2xl font-bold">{advantage.title}</h3>
              </div>
              <p className="text-travel-lightBlue">{advantage.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto border border-white/20">
          <h3 className="text-2xl font-bold mb-4">How Our AI Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-travel-lightBlue mb-4">
                Our AI combines advanced machine learning with comprehensive travel data to understand your preferences on a deeper level. It continuously learns from your interactions to improve recommendations over time.
              </p>
              <p className="text-travel-lightBlue">
                While our technology is cutting-edge, we understand that human touch is important. That's why our AI is complemented by travel experts who ensure the quality of recommendations and are available to assist when needed.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-travel-orange rounded-full mr-3"></div>
                  <span>Preference analysis</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-travel-orange rounded-full mr-3"></div>
                  <span>Destination matching</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-travel-orange rounded-full mr-3"></div>
                  <span>Itinerary generation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-travel-orange rounded-full mr-3"></div>
                  <span>Budget optimization</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-travel-orange rounded-full mr-3"></div>
                  <span>Continuous learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAdvantage;
