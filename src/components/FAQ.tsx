
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqData = [
  {
    question: "How does the AI travel planning work?",
    answer: "Our AI analyzes millions of travel data points, your preferences, and budget to create personalized itineraries in minutes. It considers factors like seasonality, local events, and even crowd levels to recommend the perfect travel plan just for you."
  },
  {
    question: "Is Voyagent free to use?",
    answer: "Voyagent offers a free tier that allows you to create basic travel plans. For more advanced features like unlimited itineraries, real-time updates, and exclusive discounts, check out our premium plans starting at just $9.99/month."
  },
  {
    question: "Can I modify the AI-generated itinerary?",
    answer: "Absolutely! While our AI creates an optimized starting point, you have complete freedom to adjust any aspect of your itinerary. Add stops, remove activities, or rearrange days - the control is entirely yours."
  },
  {
    question: "How far in advance should I plan my trip?",
    answer: "For best results, we recommend planning at least 3-4 weeks before domestic trips and 2-3 months before international trips. However, our AI can also help with last-minute planning by prioritizing available options."
  },
  {
    question: "Can Voyagent book flights and hotels?",
    answer: "Yes! Once you've finalized your itinerary, Voyagent can connect you directly to our booking partners to secure the best rates for your flights, accommodations, and activities - all within the same platform."
  }
];

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  return (
    <section id="faq" className="relative bg-neo-background py-20">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <span className="bg-neo-yellow border-3 border-black px-4 py-1 text-lg font-bold rounded-lg inline-block -rotate-2 mb-4 shadow-neo-sm">
            Frequently Asked Questions
          </span>
          <h2 className="text-4xl md:text-5xl font-archivo font-black text-black mb-4">
            Got <span className="text-neo-blue">Questions?</span> We've Got Answers
          </h2>
          <p className="text-xl max-w-2xl mx-auto font-space-grotesk">
            Everything you need to know about our AI-powered travel planning platform.
          </p>
        </div>

        <div className="bg-white border-5 border-black rounded-xl shadow-neo p-6 md:p-8 transform rotate-1 mb-12">
          <Accordion type="single" collapsible className="space-y-6">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-3 border-black rounded-lg overflow-hidden shadow-neo-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-white"
              >
                <AccordionTrigger className="px-6 py-4 text-xl font-bold font-archivo hover:no-underline hover:bg-neo-yellow/30 data-[state=open]:bg-neo-yellow/30">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 pt-2 text-lg font-space-grotesk border-t-3 border-black bg-white">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center">
          <div className="inline-block bg-neo-pink border-3 border-black px-6 py-3 rounded-lg shadow-neo transform -rotate-1">
            <p className="text-lg font-bold mb-4 text-white">Still have questions?</p>
            <Button className="bg-white border-3 border-black text-neo-blue font-bold px-6 py-3 rounded-lg shadow-neo-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
