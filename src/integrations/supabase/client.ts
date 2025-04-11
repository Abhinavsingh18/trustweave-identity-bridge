
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lwysmywblcsmgxvzkqka.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXNteXdibGNzbWd4dnprcWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTE2MzksImV4cCI6MjA1OTQyNzYzOX0.NhK5JBAU2rNvI_MExoVXflNIZv6Ze6A7ZaN0kY8DGTU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).then(res => {
        console.log(`Supabase API Response: ${res.status} for ${res.url}`);
        return res;
      });
    },
  },
});

console.log("Supabase client initialized with URL:", SUPABASE_URL);

// Add automatic retry for network-related issues
supabase.channel('custom').on('system', { event: 'reconnect' }, () => {
  console.log('Reconnecting to Supabase...');
}).subscribe();

// Verify connectivity and print number of verification records
async function checkVerificationRecords() {
  try {
    console.log("Checking verification records in Supabase...");
    
    // First check total count
    const { count, error: countError } = await supabase
      .from('verifications')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Failed to count verification records:', countError.message);
      return;
    }
    
    console.log(`Found ${count} total verification records in database.`);
    
    // Then check pending count specifically
    const { count: pendingCount, error: pendingError } = await supabase
      .from('verifications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
      
    if (pendingError) {
      console.error('Failed to count pending verification records:', pendingError.message);
      return;
    }
    
    console.log(`Found ${pendingCount} pending verification records in database.`);
    
    // Get a sample record to debug data structure
    const { data: sampleData, error: sampleError } = await supabase
      .from('verifications')
      .select('*')
      .limit(1);
      
    if (sampleError) {
      console.error('Failed to fetch sample verification record:', sampleError.message);
      return;
    }
    
    if (sampleData && sampleData.length > 0) {
      console.log('Sample verification record structure:', sampleData[0]);
    } else {
      console.log('No verification records found to sample.');
    }
  } catch (error) {
    console.error('Error checking verification records:', error);
  }
}

// Run the check immediately
checkVerificationRecords();

// Export a function to manually verify connection
export const verifySupabaseConnection = checkVerificationRecords;
