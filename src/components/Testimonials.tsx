
import React, { useState, useEffect } from 'react';
import { Star, Quote, Sparkles, User } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const Testimonials = () => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimated(true);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  const testimonials = [
    {
      name: "Alexandra Chen",
      title: "Adventure Traveler",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      quote: "Voyagent helped me discover hidden gems in Japan that I would have never found on my own. The AI recommendations were spot-on with my interests.",
      rating: 5,
      rotation: -2,
      bgColor: "bg-neo-yellow/30",
      delay: 100
    },
    {
      name: "Michael Rodriguez",
      title: "Family Vacationer",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      quote: "Planning a family trip used to take days. With Voyagent, I created the perfect itinerary for our European vacation in under an hour!",
      rating: 5,
      rotation: 0,
      bgColor: "bg-neo-pink/30",
      delay: 200
    },
    {
      name: "Sarah Johnson",
      title: "Business Traveler",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "The budget optimization feature saved me hundreds on my last business trip while still finding great accommodations near my meetings.",
      rating: 4,
      rotation: 2,
      bgColor: "bg-neo-green/30",
      delay: 300
    }
  ];

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Background with pattern */}
      <div className="absolute inset-0 bg-neo-blue opacity-90 z-0"></div>
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-16 h-16 bg-neo-yellow rounded-full border-3 border-black opacity-30 animate-bounce-slow z-0"></div>
      <div className="absolute bottom-40 left-10 w-20 h-20 bg-neo-pink rounded-full border-3 border-black opacity-30 animate-pulse z-0"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-neo-green rounded-lg border-3 border-black opacity-30 rotate-12 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 relative">
          {/* Badge with icon */}
          <div className="inline-block relative">
            <div className="absolute -top-6 -right-6 bg-neo-yellow border-3 border-black rounded-full w-12 h-12 flex items-center justify-center shadow-neo">
              <Quote className="w-6 h-6 text-black" />
            </div>
            <h2 className="section-heading text-white border-b-5 border-black pb-4 inline-block bg-neo-pink px-6 py-2 rounded-lg border-3 border-black shadow-neo transform -rotate-1">
              What Our Travelers Say
            </h2>
          </div>
          
          <p className="max-w-2xl mx-auto text-lg text-white font-space-grotesk mt-6 relative">
            <Sparkles className="absolute -left-8 top-0 text-neo-yellow h-6 w-6" />
            Don't just take our word for it. Hear from travelers who have transformed 
            their travel planning experience with Voyagent.
            <Sparkles className="absolute -right-8 bottom-0 text-neo-yellow h-6 w-6" />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <div 
                  className={`relative bg-white rounded-xl p-6 shadow-neo border-3 border-black transform transition-all duration-500 hover:translate-y-1 hover:translate-x-1 hover:shadow-none cursor-pointer ${testimonial.bgColor} ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ 
                    transform: `rotate(${testimonial.rotation}deg)`,
                    transitionDelay: `${testimonial.delay}ms`
                  }}
                >
                  <div className="text-4xl font-archivo absolute -top-6 -left-4 bg-neo-pink text-white w-10 h-10 flex items-center justify-center rounded-full border-3 border-black shadow-neo">
                    <Quote className="h-5 w-5" />
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className="border-3 border-black rounded-full mr-4 overflow-hidden w-16 h-16 transform transition-all duration-300 hover:scale-110 shadow-neo">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                    <div className="bg-white border-2 border-black rounded-lg px-3 py-2 shadow-neo transform -rotate-1">
                      <h4 className="font-archivo font-black text-neo-blue">{testimonial.name}</h4>
                      <p className="text-sm text-gray-700 font-space-grotesk flex items-center">
                        <User className="h-3 w-3 mr-1" /> {testimonial.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3 bg-white/60 border-2 border-black rounded-lg p-2 shadow-neo transform rotate-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-neo-yellow fill-neo-yellow" strokeWidth={3} />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i + testimonial.rating} className="w-6 h-6 text-gray-300" strokeWidth={3} />
                    ))}
                  </div>
                  
                  <p className="text-black font-space-grotesk italic bg-white/40 p-4 rounded-lg border-2 border-dashed border-black">
                    {testimonial.quote}
                  </p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 border-3 border-black bg-neo-yellow p-4 shadow-neo">
                <div className="flex gap-2 items-start">
                  <div className="bg-neo-green rounded-full p-2 border-2 border-black">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-archivo font-black text-black">{testimonial.name}'s Journey</h4>
                    <p className="text-xs font-space-grotesk">
                      Used Voyagent to plan a {testimonial.title.toLowerCase()} trip and rated their experience {testimonial.rating}/5 stars!
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="bg-neo-green border-3 border-black rounded-lg p-6 max-w-2xl text-center shadow-neo transform -rotate-1 relative">
            <div className="absolute -top-5 -left-5 w-16 h-16 bg-white rounded-full border-3 border-black flex items-center justify-center animate-pulse">
              <span className="font-archivo font-black text-xl text-neo-blue">10K+</span>
            </div>
            <p className="text-black font-archivo font-black text-xl">
              Join over 10,000 satisfied travelers who have transformed their travel planning experience.
            </p>
            <div className="mt-4">
              <a 
                href="#pricing" 
                className="inline-block bg-black text-white font-archivo font-bold px-6 py-3 rounded-lg border-2 border-black transition-transform hover:translate-y-1 hover:bg-neo-blue"
              >
                Start Your Journey Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
