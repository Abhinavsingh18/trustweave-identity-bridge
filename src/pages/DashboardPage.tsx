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
import { MoreVertical, Edit, Copy, Trash } from "lucide-react";
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

interface VerificationData {
  id: string;
  name: string;
  email: string;
  status: "pending" | "verified" | "rejected";
  date: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "rejected" | null>(null);

  // Mock data for demonstration
  const verificationData: VerificationData[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      status: "verified",
      date: "2024-03-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "pending",
      date: "2024-03-20",
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      status: "rejected",
      date: "2024-03-25",
    },
  ];

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

  // Redirect to auth page if not loading and no user is logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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
                  {verificationStatus === "verified" ? (
                    <span className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                        Verified
                      </Badge>
                      Account Verified
                    </span>
                  ) : verificationStatus === "pending" ? (
                    <span className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mr-2">
                        Pending
                      </Badge>
                      Verification in progress
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mr-2">
                        Unverified
                      </Badge>
                      Account not verified
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Verification Records</h2>
          <Table>
            <TableCaption>A list of your verification records.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verificationData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
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
                  <TableCell>{item.date}</TableCell>
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
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" /> Copy
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
