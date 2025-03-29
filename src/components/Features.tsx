
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
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
}) => {
  return (
    <div className="feature-card">
      <div className="mb-4 bg-travel-blue/10 inline-flex p-3 rounded-lg">
        <Icon className="h-6 w-6 text-travel-blue" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Star,
      title: "Personalized Recommendations",
      description: "Our AI analyzes your preferences to suggest destinations that match your unique travel style."
    },
    {
      icon: Globe,
      title: "AI-Generated Itineraries",
      description: "Create comprehensive day-by-day travel plans with just a few clicks."
    },
    {
      icon: Image,
      title: "Visual Discovery",
      description: "Explore destinations through curated high-quality photos and virtual tours."
    },
    {
      icon: CloudRain,
      title: "Weather Optimization",
      description: "Our AI factors in seasonal weather patterns to recommend the best time to visit."
    },
    {
      icon: MapPin,
      title: "Local Hidden Gems",
      description: "Discover off-the-beaten-path attractions and authentic local experiences."
    },
    {
      icon: Check,
      title: "Budget Optimization",
      description: "Get the most value from your travel budget with AI-powered price monitoring."
    },
  ];

  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading">
            <span className="text-travel-blue">AI-Powered</span> Travel Planning
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
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
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
