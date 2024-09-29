'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

import { Auth } from '@/components/Auth';
import { RLSChecker } from '@/components/RLSChecker';
import { MFAChecker } from '@/components/MFAChecker';
import { PITRChecker } from '@/components/PITRChecker';
import { EvidenceViewer } from '@/components/EvidenceViewer';


export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Supabase Compliance Checker</h1>
      {!session ? (
        <Auth />
      ) : (
        <div className="flex flex-col gap-2 justify-start">
          <MFAChecker />
          <RLSChecker />
          <PITRChecker/>
          <EvidenceViewer/>
        </div>
      )}
    </div>
  );
}