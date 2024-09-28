import { useState } from 'react';

export function ComplianceChecker() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const runComplianceCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkCompliance');
      const data = await response.json();
      console.log("runComplianceCheck data:",data)
      setResults(data);
    } catch (error) {
      console.error('Error running compliance check:', error);
      alert('An error occurred while running the compliance check.');
    }
    setLoading(false);
  };

  return (
    <div className="my-4">
      <h2 className="text-2xl font-bold mb-2">Compliance Checker</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={runComplianceCheck}
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Compliance Check'}
      </button>
      {results && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Results:</h3>
          <p>Overall Status: {results.allPassing ? 'Passing' : 'Failing'}</p>
          
          <h4 className="text-lg font-semibold mt-4">MFA Status:</h4>
          <ul>
            {results?.mfa?.userStatus?.map(user => (
              <li key={user.id}>{user.email}: {user.status}</li>
            ))}
          </ul>
          
          <h4 className="text-lg font-semibold mt-4">RLS Status:</h4>
          <ul>
            {results?.rls?.tableStatus?.map(table => (
              <li key={table.name}>{table.name}: {table.status}</li>
            ))}
          </ul>
          
          <h4 className="text-lg font-semibold mt-4">PITR Status:</h4>
          <ul>
            {results?.pitr?.projectStatus?.map(project => (
              <li key={project.name}>{project.name}: {project.status}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}