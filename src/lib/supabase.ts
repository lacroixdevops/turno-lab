import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.log("FALTA ENV:", supabaseUrl, supabaseKey?.slice(0,10))
}

export const supabase = createClient(supabaseUrl, supabaseKey)