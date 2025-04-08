
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ShieldCheck, UserCheck, Building, Globe, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About TrustWeave</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Secure, transparent identity verification powered by blockchain technology
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              At TrustWeave, we believe that identity verification should be secure, accessible, and
              under the control of the individual. Our mission is to create a decentralized identity
              ecosystem where people can verify their identities without compromising their privacy
              or security.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Using blockchain technology, we provide a transparent verification system that 
              eliminates centralized points of failure while giving individuals complete control 
              over their personal information.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blockchain-blue flex items-center justify-center mb-4">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Identity Verification</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Submit your identification documents securely for verification.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blockchain-blue flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Cryptographic Proof</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your verification is converted into a cryptographic proof.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-blockchain-blue flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Blockchain Security</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    The proof is recorded on the blockchain for immutable verification.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Our Technology</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              TrustWeave leverages cutting-edge blockchain technology to create a secure, 
              tamper-proof record of identity verifications while maintaining user privacy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex">
                <div className="mr-4 mt-1">
                  <div className="rounded-full w-10 h-10 bg-blockchain-light flex items-center justify-center">
                    <Lock className="h-5 w-5 text-blockchain-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Zero-Knowledge Proofs</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Verify identity attributes without revealing the actual data, maintaining privacy while establishing trust.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 mt-1">
                  <div className="rounded-full w-10 h-10 bg-blockchain-light flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-blockchain-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Decentralized Identifiers</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Create globally unique identifiers that don't rely on central registration authorities.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 mt-1">
                  <div className="rounded-full w-10 h-10 bg-blockchain-light flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blockchain-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Interoperable Standards</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Compatible with international identity standards for maximum usability across platforms and services.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 mt-1">
                  <div className="rounded-full w-10 h-10 bg-blockchain-light flex items-center justify-center">
                    <Building className="h-5 w-5 text-blockchain-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Enterprise Integration</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Easy-to-integrate API and SDK solutions for businesses needing secure identity verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blockchain-blue text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Secure Your Identity?</h2>
            <p className="text-lg mb-6">
              Join thousands of individuals and organizations using TrustWeave's secure identity verification platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => navigate('/verify')}
                className="bg-white text-blockchain-blue hover:bg-blockchain-amber hover:text-white"
              >
                Start Verification
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                variant="outline" 
                className="bg-transparent border-white hover:bg-white hover:text-blockchain-blue"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
