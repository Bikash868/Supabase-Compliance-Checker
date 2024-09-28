import { supabase } from '@/utils/supabaseClient';
import { supabaseAdmin } from '@/utils/supabaseAdmin';
import { NextResponse } from 'next/server';

async function checkMFA() {
  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw error;

  const userStatus = users.map(user => ({
    id: user.id,
    email: user.email,
    mfaEnabled: user.factors && user.factors.length > 0,
    status: user.factors && user.factors.length > 0 ? 'Passing' : 'Failing'
  }));

  const allPassing = userStatus.every(user => user.mfaEnabled);

  return {
    allPassing,
    userStatus
  };
}

async function checkRLS() {
  const { data: tables, error } = await supabaseAdmin.rpc('get_tables');
  if (error) throw error;

  const tableStatus = await Promise.all(tables.map(async (table) => {
    const { data, error } = await supabaseAdmin.rpc('get_policies', { table_name: table });
    if (error) throw error;

    return {
      name: table,
      rlsEnabled: data.length > 0,
      status: data.length > 0 ? 'Passing' : 'Failing'
    };
  }));

  const allPassing = tableStatus.every(table => table.rlsEnabled);

  return {
    allPassing,
    tableStatus
  };
}

async function checkPITR() {
  // Note: This check requires the Supabase Management API, which is not
  // directly accessible via the supabase-js library. You would need to
  // make a separate HTTP request to the Management API endpoint.
  // For this example, we'll simulate the check.
  
  const projectId = import.meta.env.NEXT_SUPABASE_PROJECT_ID;
  const managementApiKey = import.meta.env.NEXT_SUPABASE_MANAGEMENT_API_KEY;
  
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectId}`, {
    headers: {
      'Authorization': `Bearer ${managementApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error('Failed to fetch project details');

  const projectDetails = await response.json();
  const pitrEnabled = projectDetails.point_in_time_recovery_enabled;

  return {
    allPassing: pitrEnabled,
    projectStatus: [{
      name: projectDetails.name,
      pitrEnabled,
      status: pitrEnabled ? 'Passing' : 'Failing'
    }]
  };
}

export async function GET() {
  console.log('INSIDE ASYNC FUNCTION GET')
  try {
    const [mfaResults, rlsResults, pitrResults] = await Promise.all([
      checkMFA(),
      checkRLS(),
      checkPITR()
    ]);

    const allPassing = mfaResults.allPassing && rlsResults.allPassing && pitrResults.allPassing;

    const results = {
      allPassing,
      mfa: mfaResults,
      rls: rlsResults,
      pitr: pitrResults
    };

    // Log the evidence
    await supabase.from('evidence_log').insert([
      {
        message: `Compliance check run. All Passing: ${allPassing}. MFA: ${mfaResults.allPassing}, RLS: ${rlsResults.allPassing}, PITR: ${pitrResults.allPassing}`,
        timestamp: new Date().toISOString(),
        details: results
      },
    ]);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error checking compliance:', error);
    return NextResponse.json({ error: 'An error occurred while checking compliance.' }, { status: 500 });
  }
}

// export async function GET() {
//   console.log("I am here")
//   try {
//     // Implement the actual checks here. For now, we'll return dummy data.
//     const complianceResults = {
//       mfaEnabled: Math.random() > 0.5,
//       rlsEnabled: Math.random() > 0.5,
//       pitrEnabled: Math.random() > 0.5,
//     };

//     // Log the evidence
//     await supabase.from('evidence_log').insert([
//       {
//         message: `Compliance check run. MFA: ${complianceResults.mfaEnabled}, RLS: ${complianceResults.rlsEnabled}, PITR: ${complianceResults.pitrEnabled}`,
//         timestamp: new Date().toISOString(),
//       },
//     ]);

//     return NextResponse.json(complianceResults);
//   } catch (error) {
//     console.error('Error checking compliance:', error);
//     return NextResponse.json({ error: 'An error occurred while checking compliance.' }, { status: 500 });
//   }
// }