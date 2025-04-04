
import React, { useState, useEffect } from 'react';
import { Globe, Twitter, Linkedin, Mail, MapPin, Phone, ArrowUpRight, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from "@/hooks/use-mobile";

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      // Calculate when we've scrolled past 60% of the page height
      const scrollThreshold = document.documentElement.scrollHeight * 0.6;
      setShowScrollButton(window.scrollY > scrollThreshold);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-gradient-to-b from-neo-black to-slate-900 text-white pt-12 pb-8 md:pt-20 md:pb-10 border-t-5 border-black relative overflow-hidden">
      {/* Background decorative pattern */}
      <div className="absolute inset-0 grid-bg opacity-5"></div>
      
      {/* Decorative shapes - adjusted for mobile */}
      <div className="absolute top-10 right-5 md:right-10 w-12 md:w-16 h-12 md:h-16 bg-neo-blue/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-3 md:left-10 w-16 md:w-20 h-16 md:h-20 bg-neo-pink/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-1/5 md:right-1/4 w-20 md:w-24 h-20 md:h-24 bg-neo-yellow/20 rounded-full blur-xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Wavy divider at the top */}
        <div className="absolute top-0 left-0 right-0 h-6 md:h-8 overflow-hidden -translate-y-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute block w-full h-24 text-neo-black">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" fillOpacity=".1" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="currentColor" fillOpacity=".2" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" fillOpacity=".3" className="shape-fill"></path>
          </svg>
        </div>

        {/* Mobile-optimized grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 md:mb-16">
          <div className="relative z-10 transform transition-all duration-300 hover:translate-y-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-neo-blue p-2 rounded-lg border-3 border-black shadow-neo-sm transform transition-all duration-300 hover:-rotate-6">
                <Globe className="h-5 w-5 md:h-6 md:w-6" strokeWidth={3} />
              </div>
              <span className="text-xl md:text-2xl font-archivo font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Voyagent</span>
            </div>
            <p className="text-gray-300 mb-5 font-space-grotesk max-w-xs text-sm md:text-base">
              AI-powered travel planning that understands you and creates personalized experiences.
            </p>
            
            {/* Social icons - Larger touch targets for mobile */}
            <div className="flex space-x-4 mb-5">
              {[
                { icon: <Twitter size={isMobile ? 18 : 20} />, color: "hover:bg-blue-400", url: "https://x.com/anayatkhan09" },
                { icon: <Linkedin size={isMobile ? 18 : 20} />, color: "hover:bg-blue-700", url: "https://www.linkedin.com/in/anayatkhan/" },
                { icon: <Mail size={isMobile ? 18 : 20} />, color: "hover:bg-red-500", url: "mailto:anayat0khan@gmail.com" },
              ].map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className={cn(
                    "bg-white/10 text-white p-2.5 rounded-full border border-white/20 transition-all duration-300",
                    social.color,
                    "hover:text-white hover:border-transparent hover:scale-110 transform"
                  )}
                  aria-label={`Social media link ${index + 1}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            {/* Contact info - Updated for mobile */}
            <div className="space-y-3 font-space-grotesk">
              <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-300 hover:text-white transition-colors">
                <MapPin className="h-4 w-4 text-neo-yellow flex-shrink-0" />
                <span>123 Adventure Lane, Voyagent City</span>
              </div>
              <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-300 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-neo-green flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-300 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-neo-pink flex-shrink-0" />
                <span>anayat0khan@gmail.com</span>
              </div>
            </div>
          </div>
          
          {/* Footer navigation sections */}
          {isMobile ? (
            // Mobile accordion-style sections
            <div className="sm:col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { 
                  title: "Product", 
                  color: "bg-neo-blue",
                  items: [
                    { name: "Features", href: "#features" },
                    { name: "How It Works", href: "#how-it-works" },
                    { name: "Pricing", href: "#pricing" },
                    { name: "API", href: "#" },
                  ]
                },
                { 
                  title: "Resources", 
                  color: "bg-neo-pink", 
                  items: [
                    { name: "Travel Guides", href: "#" },
                    { name: "Destinations", href: "#" },
                    { name: "Blog", href: "#" },
                    { name: "Support", href: "#" },
                  ]
                },
                { 
                  title: "Company", 
                  color: "bg-neo-yellow", 
                  items: [
                    { name: "About Us", href: "#" },
                    { name: "Careers", href: "#" },
                    { name: "Press", href: "#" },
                    { name: "Contact", href: "#" },
                  ]
                }
              ].map((section, idx) => (
                <div key={idx} className="relative z-10 transform transition-all duration-300 hover:translate-y-1">
                  <h3 className="font-archivo font-black text-lg mb-3 md:mb-5 relative">
                    <span className="relative bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {section.title}
                      <div className={`absolute -bottom-2 left-0 w-12 md:w-16 h-1 ${section.color} rounded-full`}></div>
                    </span>
                  </h3>
                  <ul className="space-y-2 md:space-y-3 font-space-grotesk">
                    {section.items.map((item, index) => (
                      <li key={index} className="group">
                        <a 
                          href={item.href} 
                          className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1 group-hover:translate-x-1 transform transition-transform text-sm md:text-base"
                        >
                          <span>{item.name}</span>
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            // Desktop layout
            <>
              <div className="relative z-10 transform transition-all duration-300 hover:translate-y-1">
                <h3 className="font-archivo font-black text-lg mb-5 relative">
                  <span className="relative bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Product
                    <div className="absolute -bottom-2 left-0 w-16 h-1 bg-neo-blue rounded-full"></div>
                  </span>
                </h3>
                <ul className="space-y-3 font-space-grotesk">
                  {[
                    { name: "Features", href: "#features" },
                    { name: "How It Works", href: "#how-it-works" },
                    { name: "Pricing", href: "#pricing" },
                    { name: "API", href: "#" },
                  ].map((item, index) => (
                    <li key={index} className="group">
                      <a 
                        href={item.href} 
                        className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1 group-hover:translate-x-1 transform transition-transform"
                      >
                        <span>{item.name}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative z-10 transform transition-all duration-300 hover:translate-y-1">
                <h3 className="font-archivo font-black text-lg mb-5 relative">
                  <span className="relative bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Resources
                    <div className="absolute -bottom-2 left-0 w-16 h-1 bg-neo-pink rounded-full"></div>
                  </span>
                </h3>
                <ul className="space-y-3 font-space-grotesk">
                  {[
                    { name: "Travel Guides", href: "#" },
                    { name: "Destinations", href: "#" },
                    { name: "Blog", href: "#" },
                    { name: "Support", href: "#" },
                  ].map((item, index) => (
                    <li key={index} className="group">
                      <a 
                        href={item.href} 
                        className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1 group-hover:translate-x-1 transform transition-transform"
                      >
                        <span>{item.name}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative z-10 transform transition-all duration-300 hover:translate-y-1">
                <h3 className="font-archivo font-black text-lg mb-5 relative">
                  <span className="relative bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Company
                    <div className="absolute -bottom-2 left-0 w-16 h-1 bg-neo-yellow rounded-full"></div>
                  </span>
                </h3>
                <ul className="space-y-3 font-space-grotesk">
                  {[
                    { name: "About Us", href: "#" },
                    { name: "Careers", href: "#" },
                    { name: "Press", href: "#" },
                    { name: "Contact", href: "#" },
                  ].map((item, index) => (
                    <li key={index} className="group">
                      <a 
                        href={item.href} 
                        className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1 group-hover:translate-x-1 transform transition-transform"
                      >
                        <span>{item.name}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        
        {/* Newsletter signup - Mobile optimized */}
        <div className="mb-10 md:mb-16 relative">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 relative overflow-hidden transform hover:translate-y-1 hover:translate-x-1 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-neo-blue/10 to-neo-pink/10 opacity-20"></div>
            <h3 className="text-lg md:text-xl font-archivo font-black mb-2 md:mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent relative z-10">Stay Updated</h3>
            <p className="text-gray-300 mb-3 md:mb-4 font-space-grotesk text-xs md:text-sm relative z-10">
              Subscribe to our newsletter for travel tips, destination guides, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neo-blue/50 flex-grow text-sm md:text-base"
              />
              <button className="bg-gradient-to-r from-neo-blue to-neo-blue/90 text-white border-2 border-black rounded-lg px-4 py-2.5 font-bold shadow-neo-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all text-sm md:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer bottom - Mobile optimized */}
        <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="text-gray-400 text-xs md:text-sm mb-4 md:mb-0 font-space-mono flex flex-wrap justify-center md:justify-start items-center">
            <span className="bg-neo-blue/20 p-1 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </span>
            <span>© 2025 Voyagent. All rights reserved.</span>
            <span className="mx-2 hidden md:inline">•</span>
            <span className="flex items-center mt-1 md:mt-0">
              Built with <a href="https://anayat.xyz" className="text-neo-blue hover:text-neo-pink transition-colors mx-1 underline">Anayat</a>
            </span>
          </div>
          
          <div className="flex space-x-4 md:space-x-6 font-space-grotesk relative text-xs md:text-sm mt-2 md:mt-0">
            {["Terms", "Privacy", "Cookies"].map((item, index) => (
              <a 
                key={index} 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-neo-blue after:bottom-0 after:left-0 hover:after:w-full after:transition-all"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        
        {/* Scroll to top button - Repositioned for mobile */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.div 
              className="fixed right-4 md:right-10 bottom-24 md:bottom-32 z-50"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button 
                onClick={scrollToTop}
                className="group relative bg-gradient-to-r from-neo-yellow to-neo-orange text-black border-3 border-black rounded-full p-2.5 md:p-3 shadow-neo-sm hover:shadow-none transition-all duration-300 overflow-hidden"
                aria-label="Scroll to top"
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
                whileTap={{ 
                  scale: 0.9,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                {/* Glow effect */}
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 rounded-full blur-md transition-opacity duration-300"></span>
                
                {/* Icon */}
                <ChevronUp 
                  className="h-5 w-5 md:h-6 md:w-6 relative z-10 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" 
                  strokeWidth={3}
                />
                
                {/* Circle reveal animation on hover */}
                <motion.span 
                  className="absolute bottom-0 left-0 right-0 h-0 bg-white/20 z-0"
                  initial={{ height: 0 }}
                  whileHover={{ 
                    height: '100%',
                    transition: { duration: 0.3 }
                  }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
};

export default Footer;
