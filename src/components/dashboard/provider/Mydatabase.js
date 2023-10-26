import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtctaqgcgclbduyudbep.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Y3RhcWdjZ2NsYmR1eXVkYmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY1OTA0MTMsImV4cCI6MjAxMjE2NjQxM30.3166EIhOZiwf74rXCbnEzMfYh_32747gF4XqPO0_U4Q";
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.PUBLIC_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
