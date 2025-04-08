
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import VerificationCard from "@/components/VerificationCard";
import BlockExplorer from "@/components/BlockExplorer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Download, Share2, Eye, Copy, ShieldCheck } from "lucide-react";

const DashboardPage = () => {
  const [selectedVerification, setSelectedVerification] = useState<null | {
    title: string;
    status: "verified" | "pending" | "rejected";
    date: string;
    documentType: string;
    verificationId: string;
  }>(null);
  const { toast } = useToast();

  const mockVerifications = [
    {
      title: "National ID Verification",
      description: "Government issued identification document",
      status: "verified" as const,
      date: "2025-03-15",
      documentType: "National ID",
      verificationId: "VRF-2025-03-15-001"
    },
    {
      title: "Proof of Address",
      description: "Utility bill verification",
      status: "pending" as const,
      date: "2025-04-02",
      documentType: "Utility Bill",
      verificationId: "VRF-2025-04-02-002"
    },
    {
      title: "Driver's License",
      description: "Driver's license verification",
      status: "verified" as const,
      date: "2025-03-20",
      documentType: "Driver's License",
      verificationId: "VRF-2025-03-20-003"
    },
    {
      title: "Passport Verification",
      description: "International passport verification",
      status: "pending" as const,
      date: "2025-04-07",
      documentType: "Passport",
      verificationId: "VRF-2025-04-07-004"
    }
  ];

  const mockTransactions = [
    {
      txHash: "0x7fa9e10f13df743844371c9a370c8af66b430982c149ccd38c52e28b9a0ebb8d",
      timestamp: "2025-03-15 14:32:45 UTC",
      confirmations: 1205,
      status: "confirmed" as const
    },
    {
      txHash: "0x8f42b254c28a9c31c1c02ca3d38b2992e9e192af29a3f5c5d61d75ea71b3d9f1",
      timestamp: "2025-03-20 09:15:22 UTC",
      confirmations: 982,
      status: "confirmed" as const
    },
    {
      txHash: "0x3a801f9a280612a798866ff17a491b8889aef9e7b1ae5311c99151d8303452c9",
      timestamp: "2025-04-07 11:43:10 UTC",
      confirmations: 2,
      status: "pending" as const
    }
  ];

  const handleViewVerification = (verification: typeof mockVerifications[0]) => {
    setSelectedVerification(verification);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The verification ID has been copied to clipboard",
    });
  };

  const downloadVerificationProof = () => {
    toast({
      title: "Download started",
      description: "Your verification proof is being downloaded",
    });
    // In a real app, this would trigger an actual download
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Verification proof downloaded successfully",
      });
    }, 1500);
  };

  const shareVerification = () => {
    toast({
      title: "Share options",
      description: "Sharing options opened in a new window",
    });
    // In a real app, this would open share options
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Identity Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and track your identity verifications
            </p>
          </div>
          <Button onClick={() => location.href = '/verify'} className="bg-blockchain-blue hover:bg-blockchain-teal">
            New Verification
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Summary Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Summary</CardTitle>
                <CardDescription>
                  Overview of your identity verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Verifications</span>
                    <span className="font-medium">{mockVerifications.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Verified</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {mockVerifications.filter(v => v.status === "verified").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Pending</span>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                      {mockVerifications.filter(v => v.status === "pending").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Rejected</span>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      {mockVerifications.filter(v => v.status === "rejected").length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trusted Credential</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blockchain-dark to-blockchain-blue p-6 rounded-lg text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 mt-4 mr-4">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="mb-6">
                    <p className="text-xs text-blue-200 mb-1">VERIFIED IDENTITY</p>
                    <p className="text-lg font-bold">John A. Smith</p>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-xs text-blue-200">ID Number</span>
                      <span className="text-sm font-medium">TW-2025-12345</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-blue-200">Verification Level</span>
                      <span className="text-sm font-medium">Level 2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-blue-200">Valid Until</span>
                      <span className="text-sm font-medium">2026-04-08</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-blue-400/30">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Blockchain Verified</span>
                      <span className="text-xs font-mono">0x7fa9...bb8d</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" /> View Credential
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Tabs with verifications and blockchain records */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="verifications" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="verifications">Verifications</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain Records</TabsTrigger>
              </TabsList>
              
              <TabsContent value="verifications" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockVerifications.map((verification, index) => (
                    <VerificationCard
                      key={index}
                      title={verification.title}
                      description={verification.description}
                      status={verification.status}
                      date={verification.date}
                      documentType={verification.documentType}
                      onView={() => handleViewVerification(verification)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="blockchain" className="pt-6">
                <BlockExplorer transactions={mockTransactions} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Verification Details Dialog */}
      <Dialog open={!!selectedVerification} onOpenChange={(open) => !open && setSelectedVerification(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
            <DialogDescription>
              Information about your identity verification
            </DialogDescription>
          </DialogHeader>
          
          {selectedVerification && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{selectedVerification.title}</h3>
                  <p className="text-sm text-gray-500">ID: {selectedVerification.verificationId}</p>
                </div>
                <Badge variant={selectedVerification.status === "verified" ? "default" : "outline"} className={
                  selectedVerification.status === "verified" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                  selectedVerification.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }>
                  {selectedVerification.status === "verified" && (
                    <><CheckCircle className="h-3.5 w-3.5 mr-1" /> Verified</>
                  )}
                  {selectedVerification.status === "pending" && "Pending"}
                  {selectedVerification.status === "rejected" && "Rejected"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Document Type</p>
                  <p className="font-medium">{selectedVerification.documentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submission Date</p>
                  <p className="font-medium">{selectedVerification.date}</p>
                </div>
              </div>

              <div className="border rounded p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Verification ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded">
                      {selectedVerification.verificationId}
                    </code>
                    <Button size="icon" variant="ghost" onClick={() => copyToClipboard(selectedVerification.verificationId)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={downloadVerificationProof}>
                  <Download className="h-4 w-4 mr-2" /> Download Proof
                </Button>
                <Button variant="outline" className="flex-1" onClick={shareVerification}>
                  <Share2 className="h-4 w-4 mr-2" /> Share Verification
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DashboardPage;
