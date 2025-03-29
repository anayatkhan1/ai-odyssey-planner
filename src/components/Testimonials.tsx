
import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alexandra Chen",
      title: "Adventure Traveler",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      quote: "Voyagent helped me discover hidden gems in Japan that I would have never found on my own. The AI recommendations were spot-on with my interests.",
      rating: 5,
      rotation: -2
    },
    {
      name: "Michael Rodriguez",
      title: "Family Vacationer",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      quote: "Planning a family trip used to take days. With Voyagent, I created the perfect itinerary for our European vacation in under an hour!",
      rating: 5,
      rotation: 0
    },
    {
      name: "Sarah Johnson",
      title: "Business Traveler",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "The budget optimization feature saved me hundreds on my last business trip while still finding great accommodations near my meetings.",
      rating: 4,
      rotation: 2
    }
  ];

  return (
    <section id="testimonials" className="bg-neo-blue py-20 relative">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="section-heading text-white border-b-5 border-black pb-4 inline-block">What Our Travelers Say</h2>
          <p className="max-w-2xl mx-auto text-lg text-white font-space-grotesk mt-6">
            Don't just take our word for it. Hear from travelers who have transformed their travel planning experience with Voyagent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-neo border-3 border-black"
              style={{ transform: `rotate(${testimonial.rotation}deg)` }}
            >
              <div className="text-4xl font-archivo absolute -top-4 -left-2 text-neo-pink">"</div>
              <div className="flex items-center mb-4">
                <div className="border-3 border-black rounded-full mr-4 overflow-hidden w-14 h-14">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-archivo font-black">{testimonial.name}</h4>
                  <p className="text-sm text-gray-700 font-space-grotesk">{testimonial.title}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-neo-yellow fill-neo-yellow" strokeWidth={3} />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i + testimonial.rating} className="w-6 h-6 text-gray-300" strokeWidth={3} />
                ))}
              </div>
              <p className="text-black font-space-grotesk italic">{testimonial.quote}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="bg-neo-green border-3 border-black rounded-lg p-4 max-w-2xl text-center shadow-neo transform -rotate-1">
            <p className="text-black font-archivo font-black">
              Join over 10,000 satisfied travelers who have transformed their travel planning experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
