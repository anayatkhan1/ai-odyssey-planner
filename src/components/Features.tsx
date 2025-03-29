
import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Globe, 
  CloudRain, 
  Image as ImageIcon, 
  Check,
  Sparkles,
  Compass,
  ChevronRight,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  rotation = 0,
  bgColor = "bg-neo-yellow",
  iconBgColor = "bg-neo-blue"
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  rotation?: number;
  bgColor?: string;
  iconBgColor?: string;
}) => {
  return (
    <div 
      className={`feature-card ${bgColor} hover:bg-white transition-colors duration-300`} 
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className={`mb-6 ${iconBgColor} inline-flex p-3 rounded-full border-3 border-black transform hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-8 w-8 text-white" strokeWidth={2.5} />
      </div>
      <h3 className="text-2xl font-archivo font-black mb-3">{title}</h3>
      <p className="text-black font-space-grotesk text-base">{description}</p>
      
      <div className="mt-4 flex items-center text-sm font-medium">
        <span className="text-black font-archivo flex items-center">
          Learn more
          <svg className="ml-1 w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
};

const allFeatures = [
  {
    icon: Star,
    title: "Personalized Recommendations",
    description: "Our AI analyzes your preferences to suggest destinations that match your unique travel style.",
    rotation: -1,
    bgColor: "bg-white",
    iconBgColor: "bg-neo-pink"
  },
  {
    icon: Globe,
    title: "AI-Generated Itineraries",
    description: "Create comprehensive day-by-day travel plans with just a few clicks.",
    rotation: 1,
    bgColor: "bg-neo-yellow",
    iconBgColor: "bg-neo-blue"
  },
  {
    icon: ImageIcon,
    title: "Visual Discovery",
    description: "Explore destinations through curated high-quality photos and virtual tours.",
    rotation: -1,
    bgColor: "bg-white",
    iconBgColor: "bg-neo-green"
  },
  {
    icon: CloudRain,
    title: "Weather Optimization",
    description: "Our AI factors in seasonal weather patterns to recommend the best time to visit.",
    rotation: 1,
    bgColor: "bg-neo-mint",
    iconBgColor: "bg-neo-blue"
  },
  {
    icon: MapPin,
    title: "Local Hidden Gems",
    description: "Discover off-the-beaten-path attractions and authentic local experiences.",
    rotation: -1,
    bgColor: "bg-white",
    iconBgColor: "bg-neo-orange"
  },
  {
    icon: Check,
    title: "Budget Optimization",
    description: "Get the most value from your travel budget with AI-powered price monitoring.",
    rotation: 1,
    bgColor: "bg-neo-yellow",
    iconBgColor: "bg-neo-green"
  },
  // Additional features for the expanded view
  {
    icon: Compass,
    title: "Smart Navigation",
    description: "Get optimized routes between attractions to minimize travel time and maximize experiences.",
    rotation: -1,
    bgColor: "bg-neo-mint",
    iconBgColor: "bg-neo-blue"
  },
  {
    icon: Star,
    title: "Preference Learning",
    description: "Our AI gets smarter the more you use it, continuously improving recommendations based on your feedback.",
    rotation: 1,
    bgColor: "bg-white",
    iconBgColor: "bg-neo-pink"
  },
  {
    icon: Check,
    title: "Collaborative Planning",
    description: "Share and edit your travel plans with friends and family in real-time for group trips.",
    rotation: -1,
    bgColor: "bg-neo-yellow",
    iconBgColor: "bg-neo-green"
  },
  {
    icon: Globe,
    title: "Language Translation",
    description: "Built-in translation for over 50 languages to help you communicate effectively during your travels.",
    rotation: 1,
    bgColor: "bg-white",
    iconBgColor: "bg-neo-blue"
  }
];

const Features = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // First 6 features for the main display
  const features = allFeatures.slice(0, 6);

  return (
    <section id="features" className="bg-neo-background py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-16 h-16 bg-neo-pink rounded-full border-3 border-black z-0 animate-bounce-slow"></div>
      <div className="absolute bottom-20 left-10 w-20 h-20 bg-neo-mint rounded-lg border-3 border-black z-0 rotate-12 animate-spin-slow"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16 border-5 border-black bg-white shadow-neo-lg py-10 px-8 max-w-3xl mx-auto relative">
          <Sparkles className="absolute -top-6 -left-6 h-12 w-12 text-neo-blue bg-neo-yellow p-2 rounded-full border-3 border-black" />
          
          <h2 className="text-4xl md:text-5xl font-archivo font-black mb-6">
            <span className="text-neo-blue">AI-Powered</span> Travel Planning
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-black font-space-grotesk">
            Our intelligent platform transforms how you plan your trips with features designed to make travel planning effortless and enjoyable.
          </p>
          
          <div className="absolute -bottom-5 right-10 transform rotate-6">
            <div className="bg-neo-pink text-white font-bold py-2 px-4 rounded-lg border-3 border-black shadow-neo">
              <Compass className="inline-block mr-2 h-5 w-5" />
              <span className="font-archivo">Explore Now!</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              rotation={feature.rotation}
              bgColor={feature.bgColor}
              iconBgColor={feature.iconBgColor}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            onClick={() => setIsSheetOpen(true)}
            className="btn-primary group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Explore All Features
              <Sparkles className="ml-2 group-hover:ml-3 transition-all duration-300" />
            </span>
          </Button>
        </div>
      </div>

      {/* Features Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] border-t-4 border-black p-0 rounded-t-xl overflow-hidden">
          <div className="bg-gradient-to-r from-neo-yellow to-neo-pink h-2 w-full"></div>
          <div className="p-6 h-full overflow-y-auto">
            <SheetHeader className="mb-8 relative">
              <SheetClose className="absolute right-0 top-0 bg-white border-3 border-black rounded-full p-1 hover:bg-neo-yellow transition-colors">
                <X className="h-6 w-6" />
              </SheetClose>
              <div className="flex justify-center mb-4">
                <div className="bg-neo-blue border-3 border-black rounded-full p-2 shadow-neo">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <SheetTitle className="text-3xl font-archivo font-black text-center mb-2">
                All Voyagent Features
              </SheetTitle>
              <SheetDescription className="text-center max-w-2xl mx-auto">
                Discover the full range of AI-powered tools and features that make Voyagent the ultimate travel planning platform.
              </SheetDescription>
            </SheetHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {allFeatures.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  rotation={0} // No rotation in the sheet view
                  bgColor={feature.bgColor}
                  iconBgColor={feature.iconBgColor}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                className="bg-neo-blue text-white border-3 border-black hover:bg-neo-blue/90 shadow-neo transition-all hover:translate-y-1 hover:translate-x-1 hover:shadow-none font-archivo group"
                onClick={() => setIsSheetOpen(false)}
              >
                <span className="flex items-center">
                  Back to Features
                  <ChevronRight className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default Features;
