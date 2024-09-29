import { NextResponse } from 'next/server';

import { getTables } from './helper'
import { checkRLS } from './helper'


export async function GET() {
  try {
    const tables = await getTables();
    let result = []
    for(const table of tables) {
      const rls = await checkRLS(table);
      result.push({
        tableName: table,
        isRLS: rls ? "Yes" : "No"
      })
    }
    return NextResponse.json(result)

  } catch(err) {
    console.log(err)
    return NextResponse.json(err)
  }
}
