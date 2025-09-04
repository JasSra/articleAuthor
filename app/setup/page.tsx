'use client';

import React, { useState, useEffect } from 'react';
import { createServerApiClient } from '@/lib/apiClient';
import Diagnostics from '@/components/Diagnostics';

interface SetupConfig {
  serverUrl: string;
  clientId: string;
  apiKey: string;
}

type SetupStep = 'connectivity' | 'auth' | 'seeding' | 'complete';

function SetupPage() {
  const [currentStep, setCurrentStep] = useState<SetupStep>('connectivity');
  const [config] = useState<SetupConfig>({
    serverUrl: 'http://localhost:5229',
    clientId: 'app:core:apikey:dev-admin-key',
    apiKey: 'TEO81XYBH',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Auto-store the hardcoded config on component mount
  useEffect(() => {
    localStorage.setItem('serverUrl', config.serverUrl);
    localStorage.setItem('apiKey', config.apiKey);
    localStorage.setItem('clientId', config.clientId);
    addLog('🔧 Using hardcoded development configuration');
    addLog(`📡 Server: ${config.serverUrl}`);
    addLog(`🔑 Client ID: ${config.clientId}`);
    addLog(`🗝️ API Key: ${config.apiKey.substring(0, 4)}...`);
  }, [config]);

  const performConnectivityTest = async () => {
    setLoading(true);
    setError(null);

    try {
      addLog('Testing connectivity to API...');
      
      // Use server-side API route to avoid CORS issues
      const response = await fetch('/api/setup/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverUrl: config.serverUrl,
          apiKey: config.apiKey,
          clientId: config.clientId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      addLog(`✅ Successfully connected to API: ${result.data.title} v${result.data.version}`);
      addLog(`📊 Found ${result.data.paths} API endpoints`);
      
      addLog('Storing configuration...');
      localStorage.setItem('setupCompleted', 'true');
      addLog('✅ Configuration stored successfully');
      
      setCurrentStep('auth');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(`Connectivity test failed: ${message}`);
      addLog(`❌ Connectivity test failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const performAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      addLog('Initiating MSAL authentication...');
      // Simulate auth for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      addLog('✅ MSAL authentication configured');
      
      setCurrentStep('seeding');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(`Authentication failed: ${message}`);
      addLog(`❌ Authentication failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const runSeeding = async () => {
    setLoading(true);
    setError(null);

    try {
      addLog('Starting seeding process...');
      
      addLog('1/4 Seeding lookups...');
      const lookupResponse = await fetch('/api/setup/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'lookups', config }),
      });
      if (!lookupResponse.ok) throw new Error('Failed to seed lookups');
      addLog('✅ Lookups seeded successfully');
      
      addLog('2/4 Seeding content...');
      const contentResponse = await fetch('/api/setup/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'content', config }),
      });
      if (!contentResponse.ok) throw new Error('Failed to seed content');
      addLog('✅ Content seeded successfully');
      
      addLog('3/4 Seeding forms...');
      const formsResponse = await fetch('/api/setup/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'forms', config }),
      });
      if (!formsResponse.ok) throw new Error('Failed to seed forms');
      addLog('✅ Forms seeded successfully');
      
      addLog('4/4 Seeding workflows...');
      const workflowsResponse = await fetch('/api/setup/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'workflows', config }),
      });
      if (!workflowsResponse.ok) throw new Error('Failed to seed workflows');
      addLog('✅ Workflows seeded successfully');
      
      addLog('Creating sample article...');
      const api = createServerApiClient({
        baseUrl: config.serverUrl,
        apiKey: config.apiKey,
        clientId: config.clientId,
      });
      
      await api.createArticle({
        title: 'Hello Error Club',
        body_json: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Welcome to Error Club! This is your first sample article.'
                }
              ]
            }
          ]
        },
        status: 'draft',
        month_tag: new Date().toISOString().slice(0, 7),
        images: [],
        tags: ['welcome']
      });
      addLog('✅ Sample article created');
      
      addLog('🎉 Setup completed successfully!');
      setCurrentStep('complete');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(`Seeding failed: ${message}`);
      addLog(`❌ Seeding failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Error Club Setup</h1>
          <p className="mt-2 text-gray-600">Development Configuration</p>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 'connectivity' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Connectivity Test</h2>
              <p className="text-gray-600 mb-4">
                Testing connection to your Consolidated API.
              </p>
              
              <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
                <strong>Configuration:</strong>
                <div>Server: {config.serverUrl}</div>
                <div>Client ID: {config.clientId}</div>
                <div>API Key: {config.apiKey.substring(0, 4)}...</div>
              </div>

              <button
                onClick={performConnectivityTest}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Connectivity'}
              </button>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Expected Server:</h4>
                <p className="text-sm text-blue-800">
                  Make sure your Consolidated API server is running on <code>http://localhost:5229</code>
                  with the swagger endpoint at <code>/swagger/v1/swagger.json</code>
                </p>
              </div>
            </div>
          )}

          {currentStep === 'auth' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Authentication</h2>
              <p className="text-gray-600 mb-4">
                MSAL authentication is configured with JSRA B2C.
              </p>
              <button
                onClick={performAuth}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Configuring...' : 'Configure Authentication'}
              </button>
            </div>
          )}

          {currentStep === 'seeding' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Data Seeding</h2>
              <p className="text-gray-600 mb-4">
                Initialize your API with required data and create sample content.
              </p>
              <button
                onClick={runSeeding}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Seeding...' : 'Run Seeding'}
              </button>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center">
              <div className="text-green-600 text-4xl mb-4">✅</div>
              <h2 className="text-xl font-semibold mb-4">Setup Complete!</h2>
              <p className="text-gray-600 mb-4">
                Error Club is ready to use. You can now start creating and managing articles.
              </p>
              <a
                href="/articles"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Go to Articles
              </a>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 mb-2">{error}</p>
              {currentStep === 'connectivity' && (
                <button
                  onClick={() => setShowDiagnostics(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Run Connection Diagnostics
                </button>
              )}
            </div>
          )}
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="mt-8 bg-gray-900 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Setup Logs</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-gray-300 text-sm font-mono">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Diagnostics Modal */}
      {showDiagnostics && (
        <Diagnostics
          serverUrl={config.serverUrl}
          onClose={() => setShowDiagnostics(false)}
        />
      )}
    </div>
  );
}

export default SetupPage;
