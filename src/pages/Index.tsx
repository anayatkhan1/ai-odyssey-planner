
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import AIAdvantage from '@/components/AIAdvantage';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { ChevronUp } from 'lucide-react';

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.99],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
    },
  },
};

const sectionVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.99],
    },
  },
};

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Set up smooth scrolling behavior
  useEffect(() => {
    // Enable smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    // Show/hide scroll to top button based on scroll position
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle navigation link clicks for smooth scrolling
  useEffect(() => {
    const handleNavLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.hash && link.hash.startsWith('#')) {
        e.preventDefault();
        const id = link.hash.slice(1);
        const element = document.getElementById(id);
        
        if (element) {
          const navbarHeight = 80; // Approximate navbar height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', handleNavLinkClick);
    return () => document.removeEventListener('click', handleNavLinkClick);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="w-full min-h-screen overflow-x-hidden"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Navbar />
        <motion.div className="w-full">
          <motion.section variants={sectionVariants}>
            <Hero />
          </motion.section>
          
          <motion.section 
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Features />
          </motion.section>
          
          <motion.section 
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            <HowItWorks />
          </motion.section>
          
          <motion.section 
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            <AIAdvantage />
          </motion.section>
          
          <motion.section 
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Testimonials />
          </motion.section>
          
          <motion.section 
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Pricing />
          </motion.section>
          
          <motion.section 
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            <FAQ />
          </motion.section>
          
          <motion.section 
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            <CTASection />
          </motion.section>
          
          <Footer />
        </motion.div>
        
        {/* Scroll to top button */}
        <motion.button
          className={`fixed bottom-6 right-6 z-50 bg-neo-blue border-3 border-black rounded-full p-3 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all duration-300 ${
            showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={scrollToTop}
          initial={{ scale: 0 }}
          animate={{ 
            scale: showScrollTop ? 1 : 0,
            rotate: showScrollTop ? 0 : 90
          }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          aria-label="Scroll to top"
        >
          <ChevronUp className="text-white" strokeWidth={3} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
