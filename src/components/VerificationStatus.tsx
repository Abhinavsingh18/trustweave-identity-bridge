
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type VerificationStatusProps = {
  status: "verified" | "pending" | "rejected";
  className?: string;
};

const VerificationStatus = ({ status, className }: VerificationStatusProps) => {
  if (status === "verified") {
    return (
      <div className={cn("inline-flex items-center justify-center rounded-full bg-green-100 px-2.5 py-0.5 text-green-700 dark:bg-green-900 dark:text-green-300", className)}>
        <CheckCircle className="w-4 h-4 mr-1" />
        <span>Verified</span>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className={cn("inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-900 dark:text-amber-300", className)}>
        <Clock className="w-4 h-4 mr-1" />
        <span>Pending</span>
      </div>
    );
  }

  // This will handle the "rejected" status
  return (
    <div className={cn("inline-flex items-center justify-center rounded-full bg-red-100 px-2.5 py-0.5 text-red-700 dark:bg-red-900 dark:text-red-300", className)}>
      <AlertTriangle className="w-4 h-4 mr-1" />
      <span>Rejected</span>
    </div>
  );
};

export default VerificationStatus;
