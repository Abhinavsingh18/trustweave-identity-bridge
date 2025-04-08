
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DocumentUploader from "@/components/DocumentUploader";
import VerificationStep from "@/components/VerificationStep";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const VerifyPage = () => {
  const [step, setStep] = useState(1);
  const [uploads, setUploads] = useState({
    idCard: null as File | null,
    selfie: null as File | null
  });
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    address: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (type: "idCard" | "selfie", file: File) => {
    setUploads(prev => ({ ...prev, [type]: file }));
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Validation for each step
    if (step === 1) {
      if (!personalInfo.fullName || !personalInfo.dateOfBirth || !personalInfo.nationality || !personalInfo.address) {
        toast({
          title: "Incomplete Information",
          description: "Please fill in all required personal information fields",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!uploads.idCard || !uploads.selfie) {
        toast({
          title: "Missing Documents",
          description: "Please upload both ID card and selfie",
          variant: "destructive",
        });
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit verification request
      toast({
        title: "Verification Submitted",
        description: "Your identity verification request has been submitted successfully",
      });
      // Simulate processing and redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Complete the following steps to verify your identity on the blockchain
          </p>

          <div className="mb-12">
            <div className="flex justify-between items-center">
              <VerificationStep
                title="Personal Information"
                description="Provide your personal details"
                status={step === 1 ? "current" : step > 1 ? "completed" : "pending"}
              />
              <VerificationStep
                title="Document Upload"
                description="Upload your identification documents"
                status={step === 2 ? "current" : step > 2 ? "completed" : "pending"}
              />
              <VerificationStep
                title="Confirmation"
                description="Review and submit your verification"
                status={step === 3 ? "current" : "pending"}
                isLast
              />
            </div>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Enter your personal details exactly as they appear on your ID documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    placeholder="Enter your full legal name" 
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth" 
                    name="dateOfBirth" 
                    type="date" 
                    value={personalInfo.dateOfBirth}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input 
                    id="nationality" 
                    name="nationality" 
                    placeholder="Enter your nationality" 
                    value={personalInfo.nationality}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    placeholder="Enter your current address" 
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNext}>Continue</Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Upload clear images of your identification documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="id-card" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="id-card">ID Card / Passport</TabsTrigger>
                    <TabsTrigger value="selfie">Selfie Verification</TabsTrigger>
                  </TabsList>
                  <TabsContent value="id-card" className="pt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Upload a clear photo of your government-issued ID card or passport
                    </p>
                    <DocumentUploader documentType="ID Card/Passport" onUpload={(file) => handleFileUpload("idCard", file)} />
                  </TabsContent>
                  <TabsContent value="selfie" className="pt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Upload a clear selfie photo of yourself holding your ID document
                    </p>
                    <DocumentUploader documentType="Selfie with ID" onUpload={(file) => handleFileUpload("selfie", file)} />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>Continue</Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review and Confirm</CardTitle>
                <CardDescription>
                  Please review your information before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{personalInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{personalInfo.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nationality</p>
                      <p className="font-medium">{personalInfo.nationality}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Residential Address</p>
                      <p className="font-medium">{personalInfo.address}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-gray-500 mb-1">ID Card/Passport</p>
                      <p className="font-medium truncate">
                        {uploads.idCard?.name || "No file uploaded"}
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-gray-500 mb-1">Selfie with ID</p>
                      <p className="font-medium truncate">
                        {uploads.selfie?.name || "No file uploaded"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                  <h3 className="text-lg font-medium mb-2">Blockchain Verification</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    By submitting, your identity verification will be securely processed and 
                    recorded on the blockchain as a cryptographic proof, without exposing your 
                    personal data.
                  </p>
                  <div className="flex items-center">
                    <div className="bg-blockchain-light dark:bg-gray-700 p-2 rounded">
                      <code className="text-xs text-blockchain-blue dark:text-blockchain-teal font-mono">
                        Hash: 0x7f83b...5a922
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext} className="bg-blockchain-blue hover:bg-blockchain-teal">
                  Submit Verification
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VerifyPage;
