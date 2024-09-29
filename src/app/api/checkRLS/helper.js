import { supabase } from "@/utils/supabaseClient";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'apikey': API_KEY,
  'Content-Type': 'application/json'
};

export async function getTables() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  const paths = data.paths;
  const tables = Object.keys(paths)
    .filter(path => path !== '/')
    .map(path => path.slice(1));

  return tables;
}

export async function checkRLS(table_name) {
  const { data: rlsData, error: rlsError } = await supabase.rpc('check_rls', { table_name });
  if (rlsError) {
    return false
  }
  return rlsData;

}