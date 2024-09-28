import { supabase } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('evidence_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ evidence: data });
  } catch (error) {
    console.error('Error fetching evidence:', error);
    return NextResponse.json({ error: 'An error occurred while fetching evidence.' }, { status: 500 });
  }
}