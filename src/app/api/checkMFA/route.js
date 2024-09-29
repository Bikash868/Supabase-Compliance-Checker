import { NextResponse } from 'next/server';
import { checkMFA } from './helper';

export async function GET() {
  try {
    const result = await checkMFA();
    return NextResponse.json(result)
  } catch(err) {
    console.log(err)
    return NextResponse.json(err)
  }
}
