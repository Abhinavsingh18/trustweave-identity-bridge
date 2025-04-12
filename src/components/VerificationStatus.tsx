
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type VerificationStatusType = "verified" | "pending" | "rejected";

type VerificationStatusProps = {
  status: VerificationStatusType;
  className?: string;
  showText?: boolean;
  variant?: "default" | "badge";
};

const VerificationStatus = ({ 
  status, 
  className,
  showText = true,
  variant = "default"
}: VerificationStatusProps) => {
  // Define common styles by status
  const getStatusStyles = () => {
    if (status === "verified") {
      return {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-700 dark:text-green-300",
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
        label: "Verified"
      };
    }

    if (status === "pending") {
      return {
        bg: "bg-amber-100 dark:bg-amber-900",
        text: "text-amber-700 dark:text-amber-300",
        icon: <Clock className="w-4 h-4 mr-1" />,
        label: "Pending"
      };
    }

    // This will handle the "rejected" status
    return {
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-700 dark:text-red-300",
      icon: <AlertTriangle className="w-4 h-4 mr-1" />,
      label: "Rejected"
    };
  };

  const statusStyles = getStatusStyles();

  // If badge variant is requested, use Badge component
  if (variant === "badge") {
    return (
      <Badge 
        className={cn(
          statusStyles.bg, 
          statusStyles.text, 
          "font-medium",
          className
        )}
        variant="outline"
      >
        <div className="flex items-center">
          {statusStyles.icon}
          {showText && <span>{statusStyles.label}</span>}
        </div>
      </Badge>
    );
  }

  // Default variant
  return (
    <div className={cn(
      "inline-flex items-center justify-center rounded-full px-2.5 py-0.5",
      statusStyles.bg,
      statusStyles.text,
      className
    )}>
      {statusStyles.icon}
      {showText && <span>{statusStyles.label}</span>}
    </div>
  );
};

export default VerificationStatus;
