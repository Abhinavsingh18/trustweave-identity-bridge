import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase, refreshSupabaseData, getAllVerifications } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Check, Eye, RefreshCw, ShieldCheck, ShieldX, UserCog, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import VerificationStatus from "@/components/VerificationStatus";

type VerificationRecord = {
  id: string;
  created_at: string;
  status: "pending" | "verified" | "rejected";
  document_hash: string;
  user_id: string;
  document_path: string;
  wallet_address: string;
  signature: string;
  user_email?: string;
  personalInfo?: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
    email: string;
  };
};

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For demo purposes, hardcoded admin credentials
      // In a real app, this would be handled differently with proper admin roles
      if (email === "admin@blockchain-verify.com" && password === "admin123") {
        localStorage.setItem("isAdmin", "true");
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin dashboard",
        });
        onLogin();
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid admin credentials",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blockchain-blue" />
            <CardTitle>Admin Login</CardTitle>
          </div>
          <CardDescription>
            Login to access the verification admin panel
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blockchain-blue hover:bg-blockchain-teal" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch all verification records when component mounts
  useEffect(() => {
    fetchVerifications();
    
    // Set up a polling interval to refresh data
    const intervalId = setInterval(fetchVerifications, 30000); // Refresh every 30 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Process a verification record to extract user details
  const processVerificationRecord = (record: any): VerificationRecord => {
    // Try to extract user email from document_path
    let userEmail = 'Unknown user';
    let personalInfo = null;
    
    try {
      if (record.document_path) {
        // Log the raw document_path for debugging
        console.log(`Raw document_path for record ${record.id}:`, record.document_path);
        
        // Try to parse as JSON
        let docInfo;
        
        if (typeof record.document_path === 'string') {
          try {
            docInfo = JSON.parse(record.document_path);
          } catch (e) {
            console.log(`Not valid JSON for record ${record.id}:`, record.document_path);
            // If it's not valid JSON, try to use it as is
            if (record.document_path.includes('@')) {
              userEmail = record.document_path;
            }
          }
        } else {
          // If it's already an object, use it directly
          docInfo = record.document_path;
        }
        
        if (docInfo) {
          console.log(`Parsed document_path for record ${record.id}:`, docInfo);
          
          if (docInfo.personalInfo) {
            userEmail = docInfo.personalInfo.email || 'Email not provided';
            personalInfo = docInfo.personalInfo;
            console.log(`Extracted user email for record ${record.id}:`, userEmail);
          }
          
          // If not found in personalInfo, try direct access
          if (!userEmail && docInfo.email) {
            userEmail = docInfo.email;
            console.log(`Found email directly in document_path for record ${record.id}:`, userEmail);
          }
        }
      }
    } catch (e) {
      console.error(`Error parsing document_path for record ${record.id}:`, e, record.document_path);
    }
    
    return {
      ...record,
      user_email: userEmail,
      personalInfo
    };
  };

  // Fetch verification records
  const fetchVerifications = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching verification records from Supabase...");
      
      // Force refresh Supabase data and log the result
      const data = await refreshSupabaseData();
      
      console.log("Fetched records:", data);
      
      // Process records to extract user emails from document_path
      if (data && data.length > 0) {
        const recordsWithUserDetails = data.map(processVerificationRecord);
        
        console.log("Processed verification records:", recordsWithUserDetails);
        setVerifications(recordsWithUserDetails as VerificationRecord[]);
      } else {
        console.log("No verification records found");
        setVerifications([]);
      }
    } catch (error) {
      console.error('Error fetching verification records:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Could not load verification records: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Error loading records",
        description: "Could not load verification records. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  // Update verification status
  const updateStatus = async (id: string, status: "verified" | "rejected") => {
    try {
      console.log(`Updating verification status for ID ${id} to ${status}`);
      
      const { error } = await supabase
        .from('verifications')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error("Error updating verification status:", error);
        throw error;
      }

      console.log("Verification status updated successfully");
      
      // Update the local state
      setVerifications(
        verifications.map(record => 
          record.id === id ? { ...record, status } : record
        )
      );

      toast({
        title: `Verification ${status === "verified" ? "approved" : "rejected"}`,
        description: `The verification record has been ${status}`,
      });
      
      // Force refresh all records to ensure we're in sync with the database
      handleRefresh();
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update the verification status. Please try again."
      });
    }
  };

  // View document files
  const viewDocuments = (record: VerificationRecord) => {
    console.log("Viewing document details:", record);
    setSelectedRecord(record);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };

  // Manual refresh function
  const handleRefresh = async () => {
    toast({
      title: "Refreshing data",
      description: "Fetching the latest verification records"
    });
    console.log("Manually refreshing verification data...");
    setLoading(true);
    setError(null);
    
    try {
      // Get fresh data
      const data = await refreshSupabaseData();
      
      console.log("Refreshed data from Supabase:", data);
      
      // Process records
      if (data && data.length > 0) {
        const recordsWithUserDetails = data.map(processVerificationRecord);
        setVerifications(recordsWithUserDetails as VerificationRecord[]);
      } else {
        setVerifications([]);
      }
      
      setLoading(false);
      toast({
        title: "Data refreshed",
        description: "Verification records have been updated"
      });
    } catch (error) {
      console.error('Error refreshing verification data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to refresh data: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "Could not refresh verification data. Please try again."
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCog className="h-6 w-6 text-blockchain-blue" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage identity verification requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>
            Review and manage user identity verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blockchain-blue" />
            </div>
          ) : (
            <Table>
              <TableCaption>List of all verification requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No verification requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  verifications.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id.substring(0, 8)}</TableCell>
                      <TableCell>{record.user_email || record.user_id.substring(0, 8)}</TableCell>
                      <TableCell>{formatDate(record.created_at || new Date().toISOString())}</TableCell>
                      <TableCell>
                        <VerificationStatus status={record.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => viewDocuments(record)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Verification Documents</SheetTitle>
                                <SheetDescription>
                                  Review user submitted identity documents
                                </SheetDescription>
                              </SheetHeader>
                              <div className="py-4">
                                <div className="space-y-4">
                                  <div>
                                    <Label>User ID</Label>
                                    <p className="text-sm font-mono mt-1">{selectedRecord?.user_id}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p className="text-sm font-mono mt-1">{selectedRecord?.user_email}</p>
                                  </div>
                                  {selectedRecord?.personalInfo && (
                                    <>
                                      <div>
                                        <Label>Full Name</Label>
                                        <p className="text-sm font-medium mt-1">
                                          {selectedRecord.personalInfo.fullName || "Not provided"}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Date of Birth</Label>
                                        <p className="text-sm font-medium mt-1">
                                          {selectedRecord.personalInfo.dateOfBirth || "Not provided"}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Nationality</Label>
                                        <p className="text-sm font-medium mt-1">
                                          {selectedRecord.personalInfo.nationality || "Not provided"}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Address</Label>
                                        <p className="text-sm font-medium mt-1">
                                          {selectedRecord.personalInfo.address || "Not provided"}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                  <div>
                                    <Label>Document Hash</Label>
                                    <p className="text-sm font-mono mt-1 break-all">{selectedRecord?.document_hash}</p>
                                  </div>
                                  <div>
                                    <Label>Wallet Address</Label>
                                    <p className="text-sm font-mono mt-1 break-all">{selectedRecord?.wallet_address}</p>
                                  </div>
                                  <div>
                                    <Label>Document Data</Label>
                                    <pre className="text-xs font-mono mt-1 bg-gray-50 p-2 rounded-md overflow-auto max-h-40">
                                      {selectedRecord?.document_path ? 
                                        (typeof selectedRecord.document_path === 'string' ? 
                                          selectedRecord.document_path : 
                                          JSON.stringify(selectedRecord.document_path, null, 2)) 
                                        : "No data"}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                              <SheetFooter>
                                <div className="flex w-full justify-between">
                                  <Button 
                                    variant="outline" 
                                    className="bg-red-50 text-red-700 hover:bg-red-100"
                                    onClick={() => {
                                      if (selectedRecord) {
                                        updateStatus(selectedRecord.id, "rejected");
                                      }
                                    }}
                                  >
                                    <ShieldX className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                  <Button 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      if (selectedRecord) {
                                        updateStatus(selectedRecord.id, "verified");
                                      }
                                    }}
                                  >
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                </div>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                          
                          {record.status === "pending" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-red-50 text-red-700 hover:bg-red-100"
                                onClick={() => updateStatus(record.id, "rejected")}
                              >
                                <ShieldX className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-green-50 text-green-700 hover:bg-green-100"
                                onClick={() => updateStatus(record.id, "verified")}
                              >
                                <ShieldCheck className="h-4 w-4 mr-1" /> Verify
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Layout>
      {isLoggedIn ? (
        <AdminDashboard />
      ) : (
        <AdminLogin onLogin={() => setIsLoggedIn(true)} />
      )}
    </Layout>
  );
};

export default AdminPage;
