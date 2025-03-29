
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
        
        <h1 className="text-3xl font-archivo font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
            <p>At Voyagent, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, password, and travel preferences. We also collect information about your use of our services.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
            <p>We use your information to provide, maintain, and improve our services, process transactions, send communications, and for other purposes you may consent to.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">4. Sharing of Information</h2>
            <p>We may share your information with third-party service providers who perform services on our behalf, such as payment processing and data analysis. We may also share information when required by law or to protect our rights.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">5. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">6. Your Choices</h2>
            <p>You can access and update certain information about you from within your account settings. You can also opt-out of receiving promotional communications from us by following the instructions in those communications.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">7. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">8. International Data Transfers</h2>
            <p>Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">9. Children's Privacy</h2>
            <p>Our service is not directed to children under the age of 13. If we learn that we have collected personal information from a child under 13, we will promptly delete that information.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">10. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@voyagent.com.</p>
          </section>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Last updated: August 1, 2023</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
