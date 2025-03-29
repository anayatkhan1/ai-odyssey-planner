
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
            <p>At Voyagent, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our travel planning services.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
            <p>We may collect personal information that you voluntarily provide to us when registering for our services, such as your name, email address, and travel preferences. We may also collect information automatically through cookies and similar technologies.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
            <p>We may use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, operate, and maintain our services</li>
              <li>Improve, personalize, and expand our services</li>
              <li>Understand and analyze how you use our services</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you about our services</li>
              <li>Process your transactions</li>
              <li>Find and prevent fraud</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">4. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Service providers we use to support our business</li>
              <li>Business partners with whom we jointly offer products or services</li>
              <li>Affiliates, in which case we will require those affiliates to honor this Privacy Policy</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">5. Data Security</h2>
            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">6. Your Choices</h2>
            <p>You have the right to access, update, or delete your personal information. You may also choose to opt-out of certain communications or cookies.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">7. Third-Party Websites</h2>
            <p>Our website may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">8. Children's Privacy</h2>
            <p>Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">9. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">10. Contact Us</h2>
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
