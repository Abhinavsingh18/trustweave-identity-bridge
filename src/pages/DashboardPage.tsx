
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, Edit, Copy, Trash, ExternalLink, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getVerificationStatus } from "@/integrations/blockchain";
import { supabase } from "@/integrations/supabase/client";

// Define the verification record type
interface VerificationRecord {
  id: string;
  created_at: string;
  status: "pending" | "verified" | "rejected";
  document_hash: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<"verified" | "pending" | "rejected" | null>(null);
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(true);

  // Fetch verification status from blockchain service
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (user) {
        try {
          const status = await getVerificationStatus(user.email || "");
          setVerificationStatus(status);
        } catch (error) {
          console.error("Failed to fetch verification status:", error);
          setVerificationStatus("rejected"); // Fallback in case of error
        }
      }
    };

    fetchVerificationStatus();
  }, [user]);

  // Fetch user's verification records from Supabase
  useEffect(() => {
    const fetchVerificationRecords = async () => {
      if (!user) return;
      
      try {
        setIsLoadingVerifications(true);
        const { data, error } = await supabase
          .from('verifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching verification records:', error);
          return;
        }
        
        if (data) {
          setVerifications(data as VerificationRecord[]);
        }
      } catch (error) {
        console.error('Error fetching verification records:', error);
      } finally {
        setIsLoadingVerifications(false);
      }
    };
    
    fetchVerificationRecords();
  }, [user]);

  // Redirect to auth page if not loading and no user is logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Details about your account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Details about your account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email}`} />
                <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  {verificationStatus === "verified" && (
                    <span className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                        Verified
                      </Badge>
                      Account Verified
                    </span>
                  )}
                  {verificationStatus === "pending" && (
                    <span className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mr-2">
                        Pending
                      </Badge>
                      Verification in progress
                    </span>
                  )}
                  {verificationStatus === "rejected" && (
                    <span className="flex items-center">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mr-2">
                        Unverified
                      </Badge>
                      Account not verified
                    </span>
                  )}
                </p>
                {verificationStatus === "rejected" && (
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => navigate("/verify")}
                    >
                      Verify Identity
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Verification Records</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/verify")}
            >
              Submit New Verification
            </Button>
          </div>
          
          {isLoadingVerifications ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : verifications.length === 0 ? (
            <Card className="w-full p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <AlertTriangle className="h-10 w-10 text-yellow-500" />
                <h3 className="text-lg font-medium">No verification records found</h3>
                <p className="text-sm text-gray-500">Submit your identification documents to get verified</p>
                <Button 
                  onClick={() => navigate("/verify")}
                  className="mt-4 bg-blockchain-blue hover:bg-blockchain-teal"
                >
                  Verify My Identity
                </Button>
              </div>
            </Card>
          ) : (
            <Table>
              <TableCaption>A list of your verification records.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Document Hash</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id.substring(0, 8)}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>
                      {item.status === "verified" && (
                        <span className="flex items-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                            Verified
                          </Badge>
                          Verification complete
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="flex items-center">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mr-2">
                            Pending
                          </Badge>
                          In review
                        </span>
                      )}
                      {item.status === "rejected" && (
                        <span className="flex items-center">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mr-2">
                            Rejected
                          </Badge>
                          Failed verification
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.document_hash.substring(0, 16)}...
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Copy Hash
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
