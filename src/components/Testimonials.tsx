
import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alexandra Chen",
      title: "Adventure Traveler",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      quote: "Voyagent helped me discover hidden gems in Japan that I would have never found on my own. The AI recommendations were spot-on with my interests.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      title: "Family Vacationer",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      quote: "Planning a family trip used to take days. With Voyagent, I created the perfect itinerary for our European vacation in under an hour!",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      title: "Business Traveler",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "The budget optimization feature saved me hundreds on my last business trip while still finding great accommodations near my meetings.",
      rating: 4
    }
  ];

  return (
    <section id="testimonials" className="bg-travel-blue py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-white">What Our Travelers Say</h2>
          <p className="max-w-2xl mx-auto text-lg text-travel-lightBlue">
            Don't just take our word for it. Hear from travelers who have transformed their travel planning experience with Voyagent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/150";
                  }}
                />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-travel-orange fill-travel-orange" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i + testimonial.rating} className="w-4 h-4 text-gray-300" />
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="bg-travel-teal/20 rounded-lg p-4 max-w-2xl text-center">
            <p className="text-white font-medium">
              Join over 10,000 satisfied travelers who have transformed their travel planning experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
