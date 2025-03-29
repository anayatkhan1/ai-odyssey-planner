
import React from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ArrowDown, ArrowUp, Lightbulb, Zap, Shield, Award } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AIAdvantage = () => {
  const advantages = [
    {
      title: "87% More Personalized",
      description: "Our AI analyzes your preferences to create truly personalized recommendations.",
      longDescription: "Our AI processing engine examines over 50 different preference signals to build a comprehensive travel profile that evolves with each interaction.",
      change: "increase",
      icon: <Lightbulb className="h-12 w-12 text-neo-pink" strokeWidth={2.5} />
    },
    {
      title: "73% Time Saved",
      description: "Reduce your travel planning time from hours to minutes.",
      longDescription: "What typically takes 5-7 hours of research and planning can be accomplished in under 15 minutes with our AI-powered platform.",
      change: "decrease",
      icon: <Zap className="h-12 w-12 text-neo-yellow" strokeWidth={2.5} />
    },
    {
      title: "94% Customer Satisfaction",
      description: "Travelers rate their experience with our AI recommendations.",
      longDescription: "Based on post-trip surveys from over 10,000 travelers who used our platform to plan their vacations in the last year.",
      change: "increase",
      icon: <Award className="h-12 w-12 text-neo-green" strokeWidth={2.5} />
    }
  ];

  const aiFeatures = [
    "Preference analysis",
    "Destination matching",
    "Itinerary generation",
    "Budget optimization",
    "Continuous learning"
  ];

  // Simulate loading state for the image
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <section className="bg-neo-background py-20 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-neo-blue px-6 py-3 rounded-lg border-3 border-black shadow-neo mb-6 transform -rotate-1">
            <h2 className="font-archivo text-3xl md:text-4xl font-black text-white m-0">The AI Advantage</h2>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-black font-space-grotesk">
            Our advanced AI technology creates superior travel experiences compared to traditional methods.
          </p>
        </div>

        {/* Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {advantages.map((advantage, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <Card className="p-6 border-3 border-black rounded-xl shadow-neo bg-white transform transition-all hover:translate-y-1 hover:translate-x-1 hover:shadow-none cursor-pointer">
                  <div className="absolute -top-6 -right-6 bg-white w-16 h-16 rounded-full flex items-center justify-center border-3 border-black shadow-neo">
                    {advantage.change === "increase" ? (
                      <ArrowUp className="h-8 w-8 text-neo-green" strokeWidth={2.5} />
                    ) : (
                      <ArrowDown className="h-8 w-8 text-neo-pink" strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="mb-6">
                    {advantage.icon}
                  </div>
                  <h3 className="text-2xl font-archivo font-black mb-3">{advantage.title}</h3>
                  <p className="text-black font-space-grotesk">{advantage.description}</p>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 border-2 border-black bg-neo-yellow p-4 shadow-neo">
                <div className="space-y-2">
                  <h4 className="text-sm font-black font-archivo">How we achieve this:</h4>
                  <p className="text-sm font-space-grotesk">{advantage.longDescription}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>

        {/* How Our AI Works Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white border-3 border-black rounded-xl p-8 shadow-neo transform rotate-1">
            <h3 className="text-2xl font-archivo font-black mb-6">How Our AI Works</h3>
            <div className="space-y-6">
              <p className="text-black font-space-grotesk mb-4">
                Our AI combines advanced machine learning with comprehensive travel data to understand your preferences on a deeper level. It continuously learns from your interactions to improve recommendations over time.
              </p>
              <p className="text-black font-space-grotesk">
                While our technology is cutting-edge, we understand that human touch is important. That's why our AI is complemented by travel experts who ensure the quality of recommendations and are available to assist when needed.
              </p>
            </div>
          </div>
          
          <div className="relative">
            {!imageLoaded && <Skeleton className="w-full h-64 md:h-96 rounded-xl" />}
            <div 
              className={`bg-white border-5 border-black rounded-xl p-4 shadow-neo transform -rotate-2 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600" 
                alt="AI Technology Visualization"
                className="w-full h-64 md:h-auto object-cover border-3 border-black rounded-lg"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
              <div className="absolute top-6 -left-6 bg-neo-pink text-white font-archivo text-lg font-black py-2 px-4 rotate-6 border-3 border-black shadow-neo">
                AI-Powered
              </div>
              <div className="mt-6 p-4 bg-neo-green border-3 border-black rounded-lg">
                <h4 className="font-archivo font-black mb-3">Key AI Features</h4>
                <ul className="space-y-3">
                  {aiFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Shield className="h-5 w-5 text-neo-blue mr-3" />
                      <span className="font-space-grotesk">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a 
            href="#testimonials" 
            className="inline-block bg-neo-blue text-white font-archivo font-bold text-lg px-8 py-4 rounded-lg border-3 border-black shadow-neo transform transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
          >
            See What Our Users Say
          </a>
        </div>
      </div>
    </section>
  );
};

export default AIAdvantage;
