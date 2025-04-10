import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { Badge } from "@/components/ui/badge";
import { Check, Eye, RefreshCw, ShieldCheck, ShieldX, UserCog } from "lucide-react";

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

  // Load all verification records
  useEffect(() => {
    const fetchVerifications = async () => {
      setLoading(true);
      try {
        // Get all verification records, ordered by newest first
        const { data, error } = await supabase
          .from('verifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Process records to extract user emails from document_path
        if (data) {
          const recordsWithUserDetails = data.map(record => {
            // Try to extract user email from document_path
            let userEmail = 'Unknown user';
            try {
              const docInfo = JSON.parse(record.document_path);
              if (docInfo.personalInfo && docInfo.personalInfo.email) {
                userEmail = docInfo.personalInfo.email;
              }
            } catch (e) {
              console.error('Error parsing document_path:', e);
            }
            
            return {
              ...record,
              user_email: userEmail
            };
          });
          
          setVerifications(recordsWithUserDetails as VerificationRecord[]);
        }
      } catch (error) {
        console.error('Error fetching verification records:', error);
        toast({
          variant: "destructive",
          title: "Error loading records",
          description: "Could not load verification records"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, [toast]);

  // Update verification status
  const updateStatus = async (id: string, status: "verified" | "rejected") => {
    try {
      const { error } = await supabase
        .from('verifications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update the verification status"
      });
    }
  };

  // View document files
  const viewDocuments = (record: VerificationRecord) => {
    setSelectedRecord(record);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
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
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>
            Review and manage user identity verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <TableCell>{formatDate(record.created_at)}</TableCell>
                      <TableCell>
                        {record.status === "verified" && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Verified
                          </Badge>
                        )}
                        {record.status === "pending" && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Pending
                          </Badge>
                        )}
                        {record.status === "rejected" && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Rejected
                          </Badge>
                        )}
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
                                  <div>
                                    <Label>Document Hash</Label>
                                    <p className="text-sm font-mono mt-1 break-all">{selectedRecord?.document_hash}</p>
                                  </div>
                                  <div>
                                    <Label>Wallet Address</Label>
                                    <p className="text-sm font-mono mt-1 break-all">{selectedRecord?.wallet_address}</p>
                                  </div>
                                  <div>
                                    <Label>ID Document</Label>
                                    <div className="mt-2 p-4 border rounded-md bg-gray-50">
                                      <p className="text-sm text-gray-500">
                                        Document path: {selectedRecord?.document_path}
                                      </p>
                                      {/* In a real app, you would render the actual document image here */}
                                      <div className="mt-2 h-40 bg-gray-200 rounded flex items-center justify-center">
                                        Document preview placeholder
                                      </div>
                                    </div>
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
