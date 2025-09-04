import React, { useState } from 'react';

interface DiagnosticsProps {
  serverUrl: string;
  onClose: () => void;
}

export default function Diagnostics({ serverUrl, onClose }: DiagnosticsProps) {
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    setResults([]);

    const addResult = (message: string) => {
      setResults(prev => [...prev, message]);
    };

    try {
      // Test 1: Basic URL validation
      addResult('🔍 Testing URL format...');
      try {
        new URL(serverUrl);
        addResult('✅ URL format is valid');
      } catch {
        addResult('❌ Invalid URL format');
        return;
      }

      // Test 2: DNS resolution
      addResult('🌐 Testing DNS resolution...');
      try {
        const hostname = new URL(serverUrl).hostname;
        const response = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
        if (response.ok) {
          addResult('✅ DNS resolution successful');
        } else {
          addResult('⚠️ DNS lookup may have issues');
        }
      } catch {
        addResult('⚠️ Could not test DNS resolution');
      }

      // Test 3: Basic connectivity (without auth headers)
      addResult('📡 Testing basic connectivity...');
      try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(serverUrl, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal
        });
        addResult('✅ Basic connectivity successful');
      } catch (error: any) {
        if (error.name === 'AbortError') {
          addResult('❌ Connection timeout');
        } else {
          addResult(`⚠️ Basic connectivity test inconclusive: ${error.message}`);
        }
      }

      // Test 4: CORS preflight
      addResult('🔒 Testing CORS policy...');
      try {
        const response = await fetch(`${serverUrl}/api/swagger.json`, {
          method: 'OPTIONS',
        });
        addResult('✅ CORS preflight passed');
      } catch {
        addResult('❌ CORS preflight failed - server may not allow cross-origin requests');
      }

      // Test 5: Protocol check
      addResult('🔐 Checking protocol...');
      const url = new URL(serverUrl);
      if (url.protocol === 'https:') {
        addResult('✅ Using HTTPS (recommended)');
      } else if (url.protocol === 'http:') {
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          addResult('⚠️ Using HTTP on localhost (acceptable for development)');
        } else {
          addResult('⚠️ Using HTTP on remote server (may cause issues)');
        }
      }

    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-lg shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Connection Diagnostics
          </h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Testing connection to:</p>
            <code className="text-xs bg-gray-100 p-1 rounded break-all">{serverUrl}</code>
          </div>

          <div className="mb-4 max-h-64 overflow-y-auto">
            {results.length === 0 && !testing && (
              <p className="text-gray-500 text-sm">Click &quot;Run Diagnostics&quot; to test the connection.</p>
            )}
            {results.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1 p-1 bg-gray-50 rounded">
                {result}
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={runDiagnostics}
              disabled={testing}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {testing ? 'Running...' : 'Run Diagnostics'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
            >
              Close
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-gray-600">
            <strong>Common Issues:</strong>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>CORS: API server must allow cross-origin requests</li>
              <li>Firewall: Check if port is accessible from your network</li>
              <li>HTTPS: Mixed content issues if your site is HTTPS but API is HTTP</li>
              <li>Auth: Verify your API key and client ID are correct</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
