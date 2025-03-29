
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PricingPlan = ({ 
  name, 
  price, 
  description, 
  features, 
  popular = false,
  rotation = 0
}: { 
  name: string; 
  price: string; 
  description: string; 
  features: string[]; 
  popular?: boolean;
  rotation?: number;
}) => {
  return (
    <div 
      className={`border-5 rounded-xl p-8 ${popular ? 'bg-neo-yellow border-black relative z-10 shadow-neo-lg' : 'bg-white border-black shadow-neo'}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {popular && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-neo-pink text-white px-6 py-2 rounded-lg font-archivo text-lg border-3 border-black shadow-neo">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-archivo font-black mb-2">{name}</h3>
      <div className="mb-4 font-space-mono">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-black">/month</span>}
      </div>
      <p className="text-black mb-6 font-space-grotesk">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-6 w-6 text-neo-blue mr-2 flex-shrink-0 mt-0.5" strokeWidth={3} />
            <span className="font-space-grotesk text-black">{feature}</span>
          </li>
        ))}
      </ul>
      <Button className={`w-full border-3 border-black ${popular ? 'bg-neo-blue text-white hover:bg-neo-blue/90' : 'bg-neo-yellow text-black hover:bg-neo-yellow/90'} shadow-neo transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none font-archivo font-black`}>
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
      description: "Perfect for occasional travelers",
      features: [
        "3 AI-generated itineraries per month",
        "Destination recommendations",
        "Basic budget optimization",
        "Mobile app access"
      ],
      rotation: -1
    },
    {
      name: "Voyager",
      price: "$9.99",
      description: "Ideal for regular travelers",
      features: [
        "Unlimited AI-generated itineraries",
        "Advanced personalization",
        "Real-time price alerts",
        "Offline access to itineraries",
        "Priority customer support"
      ],
      popular: true,
      rotation: 0
    },
    {
      name: "Globetrotter",
      price: "$19.99",
      description: "For frequent & business travelers",
      features: [
        "Everything in Voyager",
        "Business travel optimization",
        "Family trip coordination",
        "Premium partner discounts",
        "Dedicated travel consultant",
        "Custom travel guides"
      ],
      rotation: 1
    }
  ];

  return (
    <section id="pricing" className="section-container relative">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="relative">
        <div className="text-center mb-16">
          <h2 className="section-heading">Simple, Transparent Pricing</h2>
          <p className="max-w-2xl mx-auto text-lg text-black font-space-grotesk">
            Choose the plan that best fits your travel style. All plans include our core AI-powered features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingPlan 
              key={index}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              popular={plan.popular}
              rotation={plan.rotation}
            />
          ))}
        </div>

        <div className="mt-12 bg-white p-6 rounded-xl max-w-3xl mx-auto border-5 border-black shadow-neo">
          <h3 className="text-xl font-archivo font-black mb-4 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="p-4 border-3 border-black rounded-lg">
              <h4 className="font-archivo font-black mb-1">Can I cancel my subscription anytime?</h4>
              <p className="text-black font-space-grotesk">Yes, you can cancel your subscription at any time with no questions asked. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="p-4 border-3 border-black rounded-lg">
              <h4 className="font-archivo font-black mb-1">Is my data secure?</h4>
              <p className="text-black font-space-grotesk">Your privacy is our priority. We use industry-standard encryption to protect your data and never share your personal information with third parties.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
