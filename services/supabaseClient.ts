import { createClient } from '@supabase/supabase-js';

// Project Reference: rlihybrgknprcehafiys
const SUPABASE_URL = 'https://rlihybrgknprcehafiys.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaWh5YnJna25wcmNlaGFmaXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDY2MzcsImV4cCI6MjA3OTkyMjYzN30.De2_hfT6hLy4qc6y0l_vaM0OcuysFjD1zRCZo68LJaA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);