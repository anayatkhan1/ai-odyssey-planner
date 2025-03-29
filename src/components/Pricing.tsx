
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PricingPlan = ({ 
  name, 
  price, 
  description, 
  features, 
  popular = false 
}: { 
  name: string; 
  price: string; 
  description: string; 
  features: string[]; 
  popular?: boolean; 
}) => {
  return (
    <div className={`border rounded-xl p-8 shadow-lg ${popular ? 'border-travel-orange border-2 relative' : 'border-gray-200'}`}>
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-travel-orange text-white px-4 py-1 rounded-full text-sm font-bold">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-gray-500">/month</span>}
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-travel-teal mr-2 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className={`w-full ${popular ? 'bg-travel-orange text-black hover:bg-travel-orange/90' : 'bg-travel-blue text-white hover:bg-travel-blue/90'}`}>
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
      ]
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
      popular: true
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
      ]
    }
  ];

  return (
    <section id="pricing" className="section-container">
      <div className="text-center mb-16">
        <h2 className="section-heading">Simple, Transparent Pricing</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
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
          />
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg max-w-3xl mx-auto">
        <h3 className="text-xl font-bold mb-4 text-center">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-1">Can I cancel my subscription anytime?</h4>
            <p className="text-gray-600">Yes, you can cancel your subscription at any time with no questions asked. You'll continue to have access until the end of your billing period.</p>
          </div>
          <div>
            <h4 className="font-bold mb-1">Is my data secure?</h4>
            <p className="text-gray-600">Your privacy is our priority. We use industry-standard encryption to protect your data and never share your personal information with third parties.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
