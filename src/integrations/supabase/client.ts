// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lwysmywblcsmgxvzkqka.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXNteXdibGNzbWd4dnprcWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTE2MzksImV4cCI6MjA1OTQyNzYzOX0.NhK5JBAU2rNvI_MExoVXflNIZv6Ze6A7ZaN0kY8DGTU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);