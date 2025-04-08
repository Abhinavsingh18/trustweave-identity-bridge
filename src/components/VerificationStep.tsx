
import { CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type VerificationStepProps = {
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
  isLast?: boolean;
};

const VerificationStep = ({
  title,
  description,
  status,
  isLast = false,
}: VerificationStepProps) => {
  return (
    <div className={cn("flex", !isLast && "pb-8")}>
      <div className="flex flex-col items-center mr-4">
        <div>
          {status === "completed" ? (
            <div className="bg-blockchain-blue rounded-full p-1">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          ) : status === "current" ? (
            <div className="relative">
              <div className="verification-pulse opacity-40"></div>
              <div className="bg-blockchain-teal rounded-full p-1 relative z-10">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          ) : (
            <div className="border-2 border-gray-300 rounded-full p-1">
              <Circle className="h-6 w-6 text-gray-300" />
            </div>
          )}
        </div>
        {!isLast && <div className="h-full w-0.5 bg-gray-200 mt-2"></div>}
      </div>
      <div className="pt-1">
        <h3 className={cn(
          "text-lg font-medium",
          status === "completed" && "text-blockchain-blue",
          status === "current" && "text-blockchain-teal",
          status === "pending" && "text-gray-500"
        )}>
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default VerificationStep;
