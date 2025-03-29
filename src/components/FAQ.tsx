
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, ChevronRight, Sparkles } from 'lucide-react';

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
  return (
    <section id="faq" className="relative bg-neo-background py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="absolute top-20 right-10 w-16 h-16 bg-neo-yellow rounded-lg border-3 border-black rotate-12 animate-bounce-slow"></div>
      <div className="absolute bottom-40 left-10 w-12 h-12 bg-neo-pink rounded-full border-3 border-black animate-spin-slow"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block bg-neo-yellow border-3 border-black px-4 py-1 text-lg font-bold rounded-lg -rotate-2 mb-4 shadow-neo-sm">
            <span className="font-bold font-archivo flex items-center">
              <MessageCircleQuestion size={18} className="mr-2" />
              Common Questions
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-archivo font-black text-black mb-4">
            Got <span className="text-neo-blue relative inline-block">
              Questions?
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 4C50 0 150 0 200 4" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span> We've Got Answers
          </h2>
          <p className="text-xl max-w-2xl mx-auto font-space-grotesk">
            Everything you need to know about our AI-powered travel planning platform.
          </p>
        </div>

        {/* FAQ accordion with enhanced styling */}
        <div className="bg-white border-5 border-black rounded-xl shadow-neo p-6 md:p-8 transform rotate-1 mb-16 relative z-10">
          <Accordion type="single" collapsible className="space-y-6">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-3 border-black rounded-lg overflow-hidden shadow-neo-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-white group"
              >
                <AccordionTrigger className="px-6 py-4 text-xl font-bold font-archivo hover:no-underline group-hover:bg-neo-yellow/30 data-[state=open]:bg-neo-yellow/30 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-6 text-lg font-space-grotesk border-t-3 border-black bg-white">
                  <div className="flex gap-4">
                    <div className="min-w-10 h-10 rounded-full bg-neo-blue border-3 border-black flex items-center justify-center">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <p>{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* "Still have questions" card with enhanced styling */}
        <div className="text-center">
          <div className="inline-block bg-neo-pink border-3 border-black px-8 py-6 rounded-lg shadow-neo transform -rotate-1 relative z-10">
            <p className="text-xl font-bold mb-4 text-white font-archivo">Still have questions?</p>
            <Button className="bg-white border-3 border-black text-neo-blue font-bold px-6 py-5 rounded-lg shadow-neo-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all font-space-grotesk group">
              Contact Support
              <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
