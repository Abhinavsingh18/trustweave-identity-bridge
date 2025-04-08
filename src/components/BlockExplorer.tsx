
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, CheckCircle2, Database } from "lucide-react";

interface TransactionProps {
  txHash: string;
  timestamp: string;
  confirmations: number;
  status: "confirmed" | "pending";
}

const Transaction = ({ txHash, timestamp, confirmations, status }: TransactionProps) => (
  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 mb-4">
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1 truncate mr-4">
        <p className="text-sm font-mono text-gray-600 dark:text-gray-300 truncate">{txHash}</p>
      </div>
      <Badge variant={status === "confirmed" ? "default" : "outline"} className="bg-blockchain-blue">
        {status === "confirmed" ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Confirmed
          </>
        ) : (
          <>
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pending
          </>
        )}
      </Badge>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{timestamp}</span>
      <span className="font-medium">{confirmations} confirmations</span>
    </div>
  </div>
);

interface BlockExplorerProps {
  transactions: TransactionProps[];
}

const BlockExplorer = ({ transactions }: BlockExplorerProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-blockchain-blue" /> 
              Blockchain Records
            </CardTitle>
            <CardDescription>
              View your identity verification records on the blockchain
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex gap-1 items-center">
            View in Explorer
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div>
            {transactions.map((tx) => (
              <Transaction key={tx.txHash} {...tx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Database className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No blockchain records found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockExplorer;
