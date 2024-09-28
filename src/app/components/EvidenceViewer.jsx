'use client'

import { useState, useEffect } from 'react';

export function EvidenceViewer() {
  const [evidence, setEvidence] = useState([]);

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    try {
      const response = await fetch('/api/getEvidence');
      const data = await response.json();
      setEvidence(data.evidence);
    } catch (error) {
      console.error('Error fetching evidence:', error);
    }
  };

  return (
    <div className="my-4">
      <h2 className="text-2xl font-bold mb-2">Evidence Log</h2>
      <ul>
        {evidence?.map((entry, index) => (
          <li key={index} className="mb-2">
            <strong>{new Date(entry.timestamp).toLocaleString()}:</strong> {entry.message}
          </li>
        ))}
      </ul>
    </div>
  );
}