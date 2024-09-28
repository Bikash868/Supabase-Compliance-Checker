'use client'

import { useState, useEffect } from 'react';
import { Auth } from '@/components/Auth';
import { ComplianceChecker } from '@/components/ComplianceChecker';
import { EvidenceViewer } from '@/components/EvidenceViewer';
import { supabase } from '@/utils/supabaseClient';

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
        <>
          <ComplianceChecker />
          <EvidenceViewer />
        </>
      )}
    </div>
  );
}