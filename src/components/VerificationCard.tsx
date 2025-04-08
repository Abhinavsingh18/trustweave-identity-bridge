
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Shield } from "lucide-react";
import VerificationStatus from "./VerificationStatus";

type VerificationCardProps = {
  title: string;
  description: string;
  status: "verified" | "pending" | "rejected";
  date: string;
  documentType: string;
  onView?: () => void;
};

const VerificationCard = ({
  title,
  description,
  status,
  date,
  documentType,
  onView,
}: VerificationCardProps) => {
  return (
    <Card className="blockchain-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <VerificationStatus status={status} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Submitted on</span>
            <span className="text-sm font-medium">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Document Type</span>
            <Badge variant="outline" className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              {documentType}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Blockchain Record</span>
            <Badge variant="outline" className="flex items-center text-blockchain-blue">
              <Shield className="h-3 w-3 mr-1" />
              {status === "verified" ? "Verified on Chain" : status === "pending" ? "Pending" : "Not Verified"}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onView} 
          variant={status === "verified" ? "default" : "outline"} 
          className={status === "verified" ? "w-full bg-blockchain-blue hover:bg-blockchain-teal" : "w-full"}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerificationCard;
