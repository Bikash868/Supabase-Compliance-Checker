import { supabase } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email } = await request.json();
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ message: 'Check your email for the login link!' });
}