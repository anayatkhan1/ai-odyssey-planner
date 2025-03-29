
import React, { useState } from 'react';
import { Check, CreditCard, Sparkles, Rocket, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const PricingPlan = ({ 
  name, 
  price, 
  description, 
  features, 
  popular = false,
  rotation = 0,
  icon,
  color
}: { 
  name: string; 
  price: string; 
  description: string; 
  features: string[]; 
  popular?: boolean;
  rotation?: number;
  icon: React.ReactNode;
  color: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`border-5 rounded-xl p-8 relative backdrop-blur-sm ${popular ? `bg-gradient-to-br from-${color}/80 to-${color}/30 border-black relative z-10 shadow-neo-lg` : 'bg-white/90 border-black shadow-neo'}`}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {popular && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-neo-pink text-white px-6 py-2 rounded-lg font-archivo text-lg border-3 border-black shadow-neo flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Most Popular
        </div>
      )}
      
      <div className={`absolute -top-5 -right-5 rounded-full w-16 h-16 bg-white border-3 border-black flex items-center justify-center ${isHovered ? 'animate-bounce-slow' : ''} shadow-neo transition-all`}>
        <div className={`text-${color}`}>
          {icon}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-archivo font-black mb-2 flex items-center">{name}</h3>
        <Badge className={`bg-${color}/10 text-black border-2 border-black mb-3`}>
          {description}
        </Badge>
      </div>

      <div className={`mb-6 font-space-mono transition-all ${isHovered ? 'scale-110' : 'scale-100'}`}>
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-black">/month</span>}
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start group">
            <div className={`flex-shrink-0 mt-0.5 h-6 w-6 rounded-full bg-${color}/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 border-2 border-black`}>
              <Check className={`h-3 w-3 text-${color}`} strokeWidth={3} />
            </div>
            <span className="font-space-grotesk text-black ml-3">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full border-3 border-black ${
          popular 
            ? `bg-${color} text-white hover:bg-${color}/90` 
            : 'bg-neo-yellow text-black hover:bg-neo-yellow/90'
        } shadow-neo transition-all hover:translate-y-1 hover:translate-x-1 hover:shadow-none font-archivo font-black flex items-center justify-center gap-2`}
      >
        <CreditCard className="h-4 w-4" />
        {price === 'Free' ? 'Sign Up Free' : 'Get Started'}
      </Button>
    </div>
  );
};

const Pricing = () => {
  const plans = [
    {
      name: "Explorer",
      price: "Free",
      description: "For occasional travelers",
      features: [
        "3 AI-generated itineraries per month",
        "Destination recommendations",
        "Basic budget optimization",
        "Mobile app access"
      ],
      rotation: -1,
      icon: <Rocket className="h-8 w-8" />,
      color: "neo-blue"
    },
    {
      name: "Voyager",
      price: "$9.99",
      description: "For regular travelers",
      features: [
        "Unlimited AI-generated itineraries",
        "Advanced personalization",
        "Real-time price alerts",
        "Offline access to itineraries",
        "Priority customer support"
      ],
      popular: true,
      rotation: 0,
      icon: <Sparkles className="h-8 w-8" />,
      color: "neo-pink"
    },
    {
      name: "Globetrotter",
      price: "$19.99",
      description: "For frequent travelers",
      features: [
        "Everything in Voyager",
        "Business travel optimization",
        "Family trip coordination",
        "Premium partner discounts",
        "Dedicated travel consultant",
        "Custom travel guides"
      ],
      rotation: 1,
      icon: <Award className="h-8 w-8" />,
      color: "neo-green"
    }
  ];

  return (
    <section id="pricing" className="relative py-24">
      {/* Background with grid and decoration */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-neo-yellow rounded-full border-3 border-black opacity-50 animate-bounce-slow"></div>
      <div className="absolute bottom-40 right-10 w-12 h-12 bg-neo-pink rounded-full border-3 border-black opacity-50 animate-pulse"></div>
      
      <div className="section-container relative">
        <div className="text-center mb-16 relative">
          {/* Title with decorative element */}
          <div className="inline-block relative">
            <div className="absolute -top-6 -right-6 transform rotate-12">
              <Sparkles className="h-8 w-8 text-neo-pink" />
            </div>
            <h2 className="section-heading mb-4">Simple, Transparent Pricing</h2>
          </div>
          
          <p className="max-w-2xl mx-auto text-lg text-black font-space-grotesk">
            Choose the plan that best fits your travel style. All plans include our core AI-powered features.
          </p>
          
          {/* Pricing toggle coming soon badge */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="mt-4 inline-block">
                <Badge className="bg-neo-blue text-white border-2 border-black cursor-help">
                  Monthly billing only
                </Badge>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-72 p-4 bg-white border-3 border-black">
              <p className="text-sm font-space-grotesk">
                Annual billing with 20% discount coming soon! Get notified when it's available.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Highlight line for popular plan */}
          <div className="absolute top-0 bottom-0 left-1/3 right-1/3 bg-gradient-to-b from-neo-pink/30 to-transparent rounded-t-3xl -z-10 hidden md:block"></div>
          
          {plans.map((plan, index) => (
            <PricingPlan 
              key={index}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              popular={plan.popular}
              rotation={plan.rotation}
              icon={plan.icon}
              color={plan.color}
            />
          ))}
        </div>
        
        {/* Enterprise section */}
        <div className="mt-16 bg-white border-5 border-black rounded-xl p-8 shadow-neo max-w-3xl mx-auto transform rotate-1">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-archivo font-black mb-2">Need a custom plan?</h3>
              <p className="text-black font-space-grotesk mb-4">
                Contact us for enterprise pricing, custom features, or special requirements for your organization.
              </p>
              <Button className="bg-black text-white border-3 border-black hover:bg-black/80 shadow-neo transition-all hover:translate-y-1 hover:translate-x-1 hover:shadow-none font-archivo">
                Contact Sales
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 bg-neo-blue/20 rounded-full border-3 border-black flex items-center justify-center">
                <CreditCard className="h-10 w-10 text-neo-blue" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Satisfaction guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-neo-green/20 px-6 py-3 rounded-lg border-3 border-black">
            <p className="font-space-mono font-bold text-black flex items-center">
              <Check className="h-5 w-5 mr-2 text-neo-green" /> 
              14-day money back guarantee on all paid plans
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
