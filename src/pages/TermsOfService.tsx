
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <motion.div 
      className="min-h-screen bg-neo-background py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-3xl mx-auto bg-white border-5 border-black shadow-neo rounded-xl p-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-black font-archivo font-bold hover:text-neo-blue transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-archivo font-bold mb-8 text-center">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
            <p>Welcome to Voyagent! These Terms of Service govern your use of our website, services, and applications. By accessing or using Voyagent, you agree to be bound by these Terms.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">2. User Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your account and for any activities that occur under your account.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">3. Content and Conduct</h2>
            <p>You may submit content to Voyagent, including travel plans, reviews, and comments. You retain ownership of your content, but grant us a license to use, modify, and display it in connection with our services.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">4. Prohibited Activities</h2>
            <p>You may not use our platform for any illegal or unauthorized purpose. You agree not to engage in any activity that interferes with or disrupts the services.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">5. Travel Information</h2>
            <p>While we strive to provide accurate travel information, we cannot guarantee the accuracy, completeness, or reliability of any travel data presented on our platform. Always verify critical information with official sources.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">6. Intellectual Property Rights</h2>
            <p>The Voyagent platform, including all content, features, and functionality, is owned by us and is protected by copyright, trademark, and other intellectual property laws.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">7. Termination</h2>
            <p>We may terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or us.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">8. Changes to Terms</h2>
            <p>We may revise these Terms at any time by updating this page. By continuing to use Voyagent after changes become effective, you agree to be bound by the revised Terms.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@voyagent.com.</p>
          </section>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Last updated: August 1, 2023</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfService;
