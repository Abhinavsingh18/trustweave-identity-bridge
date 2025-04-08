
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, BadgeCheck, Key, FileText, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Secure Identity Verification
                  <br />
                  <span className="text-blockchain-amber">On the Blockchain</span>
                </h1>
                <p className="text-xl mb-8 max-w-md">
                  TrustWeave provides a secure, transparent, and decentralized way to verify identities
                  using blockchain technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigate('/verify')}
                    className="bg-white text-blockchain-blue hover:bg-blockchain-amber hover:text-white text-lg px-8 py-6"
                  >
                    Verify Identity
                  </Button>
                  <Button 
                    onClick={() => navigate('/about')}
                    variant="outline" 
                    className="bg-transparent border-white text-white hover:bg-white hover:text-blockchain-blue text-lg px-8 py-6"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div 
                  className={`bg-white rounded-lg p-6 shadow-lg transition-all duration-300 transform ${isHovering ? 'scale-105' : ''}`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <Shield className="h-8 w-8 text-blockchain-blue mr-2" />
                      <h3 className="text-blockchain-dark font-bold text-lg">Digital Identity</h3>
                    </div>
                    <BadgeCheck className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="bg-blockchain-light p-2 rounded-full">
                        <Key className="h-6 w-6 text-blockchain-blue" />
                      </div>
                      <div>
                        <p className="font-semibold">Blockchain Secured</p>
                        <p className="text-sm text-gray-500">Cryptographically verified identity</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-blockchain-light p-2 rounded-full">
                        <FileText className="h-6 w-6 text-blockchain-blue" />
                      </div>
                      <div>
                        <p className="font-semibold">Document Verification</p>
                        <p className="text-sm text-gray-500">Secure document processing</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-blockchain-light p-2 rounded-full">
                        <BadgeCheck className="h-6 w-6 text-blockchain-blue" />
                      </div>
                      <div>
                        <p className="font-semibold">Trusted Credentials</p>
                        <p className="text-sm text-gray-500">Share verified credentials securely</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Verification ID</p>
                        <p className="text-sm font-mono font-medium">0x71c...93e4</p>
                      </div>
                      <div className="bg-green-100 px-3 py-1 rounded-full text-green-700 text-sm font-medium">
                        Active
                      </div>
                    </div>
                  </div>
                </div>
                {isHovering && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-r from-blockchain-blue/20 to-blockchain-teal/20 rounded-lg z-[-1] blur-md"
                  />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How TrustWeave Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our blockchain-based verification system ensures your identity remains secure,
              private, and under your control.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="blockchain-card">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-blockchain-blue flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Securely upload your identification documents for verification on our platform.
                </p>
              </CardContent>
            </Card>
            <Card className="blockchain-card">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-blockchain-blue flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verify Identity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our system verifies your documents and creates a secure digital identity credential.
                </p>
              </CardContent>
            </Card>
            <Card className="blockchain-card">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-blockchain-blue flex items-center justify-center mb-4">
                  <BadgeCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Blockchain Record</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your verification is securely recorded on the blockchain for immutable proof.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="bg-blockchain-blue rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Identity?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of individuals and organizations using TrustWeave for secure identity verification.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-blockchain-blue hover:bg-blockchain-amber hover:text-white text-lg px-8 py-6"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
