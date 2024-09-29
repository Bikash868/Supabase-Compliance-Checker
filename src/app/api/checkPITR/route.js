import { NextResponse } from 'next/server';
import { checkPITR } from './helper';

export async function GET() {
  try {
    const result = await checkPITR();
    return NextResponse.json(result)
  } catch(err) {
    console.log(err)
    return NextResponse.json(err)
  }
}
