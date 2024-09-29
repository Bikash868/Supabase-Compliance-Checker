import { useState,useEffect } from 'react';

export function RLSChecker() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const runComplianceCheck = async () => {
    setLoading(true);
      try {
        const response = await fetch('/api/checkRLS');
        const data = await response.json();
        setResults(data);
      } catch (error) {
          console.error('Error:', error.message);
      }
    setLoading(false);
  };

  useEffect(()=>{
    runComplianceCheck();
  },[])

  const showResult = Boolean(results && results.length);

  return (
    <div className="my-4 border border-blue-200 rounded p-4 align-center">
      <div className='flex justify-between'>
        <h2 className="text-2xl font-bold mb-2">RLS Checker</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={runComplianceCheck}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh RLS Check'}
        </button>
      </div>
      {showResult && (
        <div className="container mt-4">
          <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-black">Table Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-black">isRLS Implemented ?</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index} className="bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-black">{row.tableName}</td>
                <td className="border border-gray-300 px-4 py-2 text-black">{row.isRLS}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
