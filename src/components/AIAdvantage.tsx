
import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ArrowDown, ArrowUp, Lightbulb, Zap, Shield, Award, Brain, Sparkles, BarChart, Rocket } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AIAdvantage = () => {
  const advantages = [
    {
      title: "87% More Personalized",
      description: "Our AI analyzes your preferences to create truly personalized recommendations.",
      longDescription: "Our AI processing engine examines over 50 different preference signals to build a comprehensive travel profile that evolves with each interaction.",
      change: "increase",
      icon: <Lightbulb className="h-12 w-12 text-neo-pink" strokeWidth={2.5} />,
      bgColor: "bg-gradient-to-br from-neo-pink/20 to-neo-pink/5"
    },
    {
      title: "73% Time Saved",
      description: "Reduce your travel planning time from hours to minutes.",
      longDescription: "What typically takes 5-7 hours of research and planning can be accomplished in under 15 minutes with our AI-powered platform.",
      change: "decrease",
      icon: <Zap className="h-12 w-12 text-neo-yellow" strokeWidth={2.5} />,
      bgColor: "bg-gradient-to-br from-neo-yellow/20 to-neo-yellow/5"
    },
    {
      title: "94% Customer Satisfaction",
      description: "Travelers rate their experience with our AI recommendations.",
      longDescription: "Based on post-trip surveys from over 10,000 travelers who used our platform to plan their vacations in the last year.",
      change: "increase",
      icon: <Award className="h-12 w-12 text-neo-green" strokeWidth={2.5} />,
      bgColor: "bg-gradient-to-br from-neo-green/20 to-neo-green/5"
    }
  ];

  const aiFeatures = [
    {
      name: "Preference analysis",
      icon: <Brain className="h-5 w-5 text-neo-blue" />,
      color: "bg-neo-blue"
    },
    {
      name: "Destination matching",
      icon: <Sparkles className="h-5 w-5 text-neo-pink" />,
      color: "bg-neo-pink"
    },
    {
      name: "Itinerary generation",
      icon: <BarChart className="h-5 w-5 text-neo-yellow" />,
      color: "bg-neo-yellow"
    },
    {
      name: "Budget optimization",
      icon: <Shield className="h-5 w-5 text-neo-green" />,
      color: "bg-neo-green"
    },
    {
      name: "Continuous learning",
      icon: <Rocket className="h-5 w-5 text-neo-blue" />,
      color: "bg-neo-blue"
    }
  ];

  // Simulate loading state for the image
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Animation for cards
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimated(true);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="bg-neo-background py-20 relative overflow-hidden" id="ai-advantage">
      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-16 h-16 bg-neo-yellow rounded-full border-3 border-black opacity-50 animate-bounce-slow"></div>
      <div className="absolute bottom-20 left-10 w-12 h-12 bg-neo-pink rounded-full border-3 border-black opacity-50 animate-pulse"></div>
      <div className="absolute top-60 left-20 w-10 h-10 bg-neo-mint rounded-lg border-3 border-black opacity-50 rotate-12 animate-spin-slow"></div>
      
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 relative">
          {/* Decorative sparkles */}
          <div className="absolute -top-12 -left-6 transform rotate-12">
            <Sparkles className="h-8 w-8 text-neo-yellow" />
          </div>
          <div className="absolute -top-8 right-1/4 transform -rotate-12">
            <Sparkles className="h-6 w-6 text-neo-pink" />
          </div>
          
          <div className="inline-block bg-neo-blue px-6 py-3 rounded-lg border-3 border-black shadow-neo mb-6 transform -rotate-1 relative">
            <div className="absolute -top-3 -right-3 bg-neo-yellow w-8 h-8 rounded-full flex items-center justify-center border-2 border-black">
              <Rocket className="h-4 w-4 text-black" />
            </div>
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
                <Card 
                  className={`p-6 border-3 border-black rounded-xl shadow-neo ${advantage.bgColor} transform transition-all duration-500 hover:translate-y-1 hover:translate-x-1 hover:shadow-none cursor-pointer ${animated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="absolute -top-6 -right-6 bg-white w-16 h-16 rounded-full flex items-center justify-center border-3 border-black shadow-neo">
                    {advantage.change === "increase" ? (
                      <ArrowUp className="h-8 w-8 text-neo-green" strokeWidth={2.5} />
                    ) : (
                      <ArrowDown className="h-8 w-8 text-neo-pink" strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="mb-6 transform transition-all duration-300 hover:scale-110">
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
          <div className="bg-white border-3 border-black rounded-xl p-8 shadow-neo transform rotate-1 relative">
            <div className="absolute -top-5 -left-5 bg-neo-pink text-white font-archivo text-sm font-bold py-1 px-3 rotate-6 border-2 border-black shadow-neo-sm">
              Smart Tech
            </div>
            
            <h3 className="text-2xl font-archivo font-black mb-6 flex items-center">
              <Brain className="h-6 w-6 mr-2 text-neo-blue" />
              How Our AI Works
            </h3>
            
            <div className="space-y-6">
              <p className="text-black font-space-grotesk mb-4 relative pl-4 border-l-3 border-neo-blue">
                Our AI combines advanced machine learning with comprehensive travel data to understand your preferences on a deeper level. It continuously learns from your interactions to improve recommendations over time.
              </p>
              <p className="text-black font-space-grotesk relative pl-4 border-l-3 border-neo-pink">
                While our technology is cutting-edge, we understand that human touch is important. That's why our AI is complemented by travel experts who ensure the quality of recommendations and are available to assist when needed.
              </p>
            </div>
            
            {/* Decorative code lines */}
            <div className="mt-6 p-4 bg-black rounded-lg overflow-hidden">
              <div className="text-neo-green font-space-mono text-xs">
                <div className="text-neo-yellow">class TravelAI {</div>
                <div className="ml-4 text-neo-green">def analyze_preferences(user_data):</div>
                <div className="ml-8 text-neo-mint">return personalized_results</div>
                <div className="text-neo-yellow">}</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {!imageLoaded && <Skeleton className="w-full h-64 md:h-96 rounded-xl" />}
            <div 
              className={`bg-white border-5 border-black rounded-xl p-4 shadow-neo transform -rotate-2 transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'} relative`}
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
              
              {/* New interactive feature badges */}
              <div className="mt-6 p-4 bg-neo-green border-3 border-black rounded-lg overflow-hidden relative">
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center text-xs font-bold rotate-12">
                  AI
                </div>
                <h4 className="font-archivo font-black mb-3 flex items-center">
                  <Shield className="h-5 w-5 text-neo-blue mr-2" />
                  Key AI Features
                </h4>
                <ul className="space-y-3">
                  {aiFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center group">
                      <div className={`h-8 w-8 rounded-full ${feature.color} flex items-center justify-center mr-3 border-2 border-black transform transition-all duration-300 group-hover:scale-110`}>
                        {feature.icon}
                      </div>
                      <span className="font-space-grotesk font-bold">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Decorative element */}
              <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-neo-yellow rounded-full border-3 border-black flex items-center justify-center animate-pulse">
                <Zap className="h-8 w-8 text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center relative">
          <a 
            href="#testimonials" 
            className="inline-block bg-neo-blue text-white font-archivo font-bold text-lg px-8 py-4 rounded-lg border-3 border-black shadow-neo transform transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              See What Our Users Say
              <Sparkles className="ml-2 h-5 w-5 transform transition-all duration-300 group-hover:rotate-12" />
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 group-hover:h-full -z-0"></span>
          </a>
          
          {/* User count indicator */}
          <div className="absolute -right-2 bottom-0 transform rotate-6">
            <div className="bg-white border-2 border-black rounded-full py-1 px-4 shadow-neo-sm flex items-center text-sm">
              <span className="font-archivo font-bold text-neo-blue">10,000+</span>
              <span className="ml-1">happy travelers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAdvantage;
