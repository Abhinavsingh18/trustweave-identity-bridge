
/**
 * This file contains functionality for interacting with blockchain services
 * for verification purposes.
 */

import { submitVerificationToBlockchain, verifyBlockchainRecord } from "@/utils/blockchainUtils";
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks the verification status of a user by email
 * In a real application, this would query the blockchain or a database
 * that tracks the verification status
 * 
 * @param email - The email of the user to check
 * @returns - The verification status (verified, pending, or rejected)
 */
export const getVerificationStatus = async (email: string): Promise<"verified" | "pending" | "rejected"> => {
  // For demo purposes, we're simulating different statuses
  // In a real app, this would check the blockchain or a database
  
  if (!email) return "rejected";
  
  try {
    // Get the user ID from the email
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user?.id) {
      return "rejected";
    }
    
    // Get the user's verification records
    const { data: verifications, error } = await supabase
      .from('verifications')
      .select('status')
      .eq('user_id', authData.user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !verifications || verifications.length === 0) {
      // Fall back to the hash method if no verifications found
      return hashBasedStatus(email);
    }
    
    return verifications[0].status as "verified" | "pending" | "rejected";
  } catch (error) {
    console.error("Error checking verification status:", error);
    // Fall back to hash method
    return hashBasedStatus(email);
  }
};

// Helper function for determining status based on email hash
function hashBasedStatus(email: string): "verified" | "pending" | "rejected" {
  const emailHash = hashString(email);
  const statusCode = parseInt(emailHash.substring(0, 8), 16) % 3;
  
  switch (statusCode) {
    case 0: return "verified";
    case 1: return "pending";
    default: return "rejected";
  }
}

/**
 * Helper function to create a deterministic hash of a string
 * This is just for demo purposes
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Verifies a document on the blockchain
 * In a real application, this would create a transaction on the blockchain
 * 
 * @param documentHash - The hash of the document to verify
 * @param userAddress - The blockchain address of the user
 * @returns - The transaction details
 */
export const verifyDocument = async (documentHash: string, userAddress: string) => {
  const verificationData = {
    documentHash,
    userAddress,
    timestamp: Date.now()
  };
  
  return await submitVerificationToBlockchain(verificationData);
};

/**
 * Checks the validity of a verification record
 * 
 * @param transactionHash - The blockchain transaction hash to verify
 * @returns - Whether the record is valid and its data
 */
export const checkVerification = async (transactionHash: string) => {
  return await verifyBlockchainRecord(transactionHash);
};

/**
 * For admin use - check if a user has admin privileges
 * Currently this just checks localStorage, but in a real app this 
 * would check a proper role system
 */
export const checkAdminStatus = (): boolean => {
  return localStorage.getItem("isAdmin") === "true";
};
