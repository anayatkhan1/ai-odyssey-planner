
import React from 'react';
import { 
  MapPin, 
  Star, 
  Globe, 
  CloudRain, 
  Image, 
  Check 
} from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  rotation = 0
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  rotation?: number;
}) => {
  return (
    <div className="feature-card" style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="mb-4 bg-neo-yellow inline-flex p-3 rounded-lg border-3 border-black">
        <Icon className="h-6 w-6 text-black" strokeWidth={3} />
      </div>
      <h3 className="text-xl font-archivo font-black mb-2">{title}</h3>
      <p className="text-black font-space-grotesk">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Star,
      title: "Personalized Recommendations",
      description: "Our AI analyzes your preferences to suggest destinations that match your unique travel style.",
      rotation: -1
    },
    {
      icon: Globe,
      title: "AI-Generated Itineraries",
      description: "Create comprehensive day-by-day travel plans with just a few clicks.",
      rotation: 1
    },
    {
      icon: Image,
      title: "Visual Discovery",
      description: "Explore destinations through curated high-quality photos and virtual tours.",
      rotation: -1
    },
    {
      icon: CloudRain,
      title: "Weather Optimization",
      description: "Our AI factors in seasonal weather patterns to recommend the best time to visit.",
      rotation: 1
    },
    {
      icon: MapPin,
      title: "Local Hidden Gems",
      description: "Discover off-the-beaten-path attractions and authentic local experiences.",
      rotation: -1
    },
    {
      icon: Check,
      title: "Budget Optimization",
      description: "Get the most value from your travel budget with AI-powered price monitoring.",
      rotation: 1
    },
  ];

  return (
    <section id="features" className="bg-neo-yellow py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16 border-5 border-black bg-white shadow-neo-lg py-8 px-4 max-w-3xl mx-auto">
          <h2 className="section-heading">
            <span className="text-neo-blue">AI-Powered</span> Travel Planning
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-black font-space-grotesk">
            Our intelligent platform transforms how you plan your trips with features designed to make travel planning effortless and enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              rotation={feature.rotation}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
