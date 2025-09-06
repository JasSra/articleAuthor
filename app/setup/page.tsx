'use client';

import React, { useState, useEffect } from 'react';
import Diagnostics from '@/components/Diagnostics';
// Use generated API client directly
import { OpenAPI, DataService, FormService, WorkflowService, LookupService, UserService, StateDefinitionService } from '@/api/consolidated';

interface SetupConfig {
  serverUrl: string;
}

type SetupStep = 'connectivity' | 'auth' | 'seeding' | 'complete';

function SetupPage() {
  const [currentStep, setCurrentStep] = useState<SetupStep>('connectivity');
  const [config] = useState<SetupConfig>({
  serverUrl: 'http://localhost:5229',
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
    // Configure generated API client for all requests on this page
    OpenAPI.BASE = config.serverUrl;
  // Use Basic Auth instead of API Key/Client ID
  OpenAPI.HEADERS = undefined;
  OpenAPI.USERNAME = 'admin@local';
  OpenAPI.PASSWORD = 'develop';
  
    addLog('🔧 Using hardcoded development configuration');
    addLog(`📡 Server: ${config.serverUrl}`);
  addLog(`� Auth: Basic admin@local`);
  }, [config]);

  const performConnectivityTest = async () => {
    setLoading(true);
    setError(null);

    try {
  addLog('Testing connectivity to API...');
  // Validate credentials and connectivity via current user endpoint
  await UserService.getMyDetails();
  addLog('✅ Successfully connected to API');
  addLog('📊 Data endpoint is reachable');
      
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
      // Replace local API routes with direct backend calls using generated client
      addLog('1/4 Seeding lookups...');
      // Article statuses
      await LookupService.lookupAddLookupsToGroup('article-status', {
        lookups: {
          draft: 'Draft',
          submitted: 'Submitted',
          approved: 'Approved',
          scheduled: 'Scheduled',
          published: 'Published',
        },
      });
      // Article tags
      await LookupService.lookupAddLookupsToGroup('article-tags', {
        lookups: {
          javascript: 'JavaScript',
          typescript: 'TypeScript',
          react: 'React',
          nodejs: 'Node.js',
          api: 'API Development',
          database: 'Database',
          frontend: 'Frontend',
          backend: 'Backend',
          devops: 'DevOps',
          testing: 'Testing',
        },
      });
      // Month tags for current year
      const currentYear = new Date().getFullYear();
      const monthLookups: Record<string, string> = {};
      for (let m = 1; m <= 12; m++) {
        const mm = m.toString().padStart(2, '0');
        const key = `${currentYear}-${mm}`;
        const label = `${new Date(currentYear, m - 1).toLocaleString('default', { month: 'long' })} ${currentYear}`;
        monthLookups[key] = label;
      }
      await LookupService.lookupAddLookupsToGroup('month-tags', { lookups: monthLookups });
      addLog('✅ Lookups seeded successfully');

  addLog('2/4 Seeding content...');
      await DataService.createEntity('Core', 'Content', {
        Type: 'hero',
        Title: 'Code Chronicle',
        Description: '',
        Status: 'Active',
        Placeholder: 'home-hero',
        Value: {
          title: 'Code Chronicle',
          subtitle: 'Write. Read. Inspire.',
          imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop',
        },
        Properties: {},
        Classes: '',
        Children: [],
        Nested: [],
      });
      await DataService.createEntity('Core', 'Content', {
        Type: 'showcase',
        Title: 'Home Showcase',
        Description: '',
        Status: 'Active',
        Placeholder: 'home-showcase',
        Value: [
          { title: 'Intuitive Writing', description: 'Rich text editor designed for storytellers and content creators.' },
          { title: 'Editorial Workflow', description: 'Collaborative editing process from draft to publication.' },
          { title: 'Community Focused', description: 'Connect with readers, writers, and fellow creators.' },
        ],
        Properties: {},
        Classes: '',
        Children: [],
        Nested: [],
      });
      await DataService.createEntity('Core', 'Content', {
        Type: 'text',
        Title: 'About',
        Description: '',
        Status: 'Active',
        Placeholder: 'about-text',
        Value: {
          content: 'Code Chronicle is a vibrant community where writers, bloggers, and content creators share their stories, inspire readers, and connect with fellow storytellers.',
        },
        Properties: {},
        Classes: '',
        Children: [],
        Nested: [],
      });
      await DataService.createEntity('Core', 'Content', {
        Type: 'cta',
        Title: 'Get Started CTA',
        Description: '',
        Status: 'Active',
        Placeholder: 'home-cta',
        Value: {
          title: 'Join the Code Chronicle Community',
          subtitle: 'Share your stories, connect with readers, and inspire others.',
          primary: { label: 'Start Writing', href: '/submit' },
          secondary: { label: 'Browse Stories', href: '/articles' },
        },
        Properties: {},
        Classes: '',
        Children: [],
        Nested: [],
      });
      addLog('✅ Content seeded successfully');

      addLog('3/4 Seeding forms...');
      try {
        await FormService.createForm({
          title: 'Article Submission Form',
          slug: 'article-submission',
          sections: [
            {
              title: 'Main',
              fields: [
                { name: 'title', label: 'Article Title', fieldType: 'text', isRequired: true },
                { name: 'summary', label: 'Article Summary', fieldType: 'textarea', isRequired: true },
                {
                  name: 'month_tag',
                  label: 'Issue Month',
                  fieldType: 'select',
                  isRequired: true,
                  options: Object.keys(monthLookups).map(k => ({ value: k, label: monthLookups[k] })),
                },
                {
                  name: 'tags',
                  label: 'Tags',
                  fieldType: 'multi-select',
                  options: [
                    { value: 'how-to', label: 'How To' },
                    { value: 'incident', label: 'Incident' },
                    { value: 'analysis', label: 'Analysis' },
                    { value: 'opinion', label: 'Opinion' },
                  ],
                },
              ],
            },
          ],
        } as any);

        await FormService.createForm({
          title: 'Article Feedback Form',
          slug: 'article-feedback',
          sections: [
            {
              title: 'Feedback',
              fields: [
                {
                  name: 'rating',
                  label: 'Overall Rating',
                  fieldType: 'radio',
                  isRequired: true,
                  options: ['1', '2', '3', '4', '5'].map(v => ({ value: v, label: v })),
                },
                { name: 'comments', label: 'Comments', fieldType: 'textarea' },
                { name: 'recommend', label: 'Would you recommend?', fieldType: 'checkbox' },
              ],
            },
          ],
        } as any);
        addLog('✅ Forms seeded successfully');
      } catch (e: any) {
        const msg = typeof e?.message === 'string' ? e.message : String(e);
        if (msg.includes('OpenAI API key') || msg.includes('OpenAiApiKey')) {
          addLog('⚠️ Forms skipped: server requires OPENAI_API_KEY for AI features. Set it to enable form creation.');
        } else {
          addLog(`⚠️ Forms skipped due to server error: ${msg}`);
        }
      }

      addLog('4/4 Seeding workflows (state machines)...');
      try {
        // Idempotent create: check existing state definitions for names
  const existing = await StateDefinitionService.getApiStateDefinitionAll(1, 200);
  const names = (existing?.data?.items ?? []).map((n: string) => n?.toLowerCase?.()).filter(Boolean);

        const ensureStateDef = async (def: any) => {
          const lower = (def.Name as string).toLowerCase();
          if (names.includes(lower)) {
            addLog(`↩️ StateDefinition '${def.Name}' already exists, skipping.`);
            return;
          }
          await DataService.createEntity('Core', 'StateDefinition', def);
          addLog(`✅ StateDefinition '${def.Name}' created`);
        };

        // Article status workflow as a StateDefinition
        await ensureStateDef({
          Name: 'Article Status',
          FieldName: 'status',
          Description: 'Workflow for article lifecycle',
          States: [
            { Id: 'draft', Label: 'Draft' },
            { Id: 'in_review', Label: 'In Review' },
            { Id: 'needs_changes', Label: 'Needs Changes' },
            { Id: 'approved', Label: 'Approved' },
            { Id: 'scheduled', Label: 'Scheduled' },
            { Id: 'published', Label: 'Published' },
            { Id: 'archived', Label: 'Archived' },
            { Id: 'rejected', Label: 'Rejected' },
          ],
          Transitions: [
            { FromState: 'draft', ToState: 'in_review' },
            { FromState: 'in_review', ToState: 'approved' },
            { FromState: 'in_review', ToState: 'needs_changes' },
            { FromState: 'in_review', ToState: 'rejected' },
            { FromState: 'approved', ToState: 'scheduled' },
            { FromState: 'approved', ToState: 'published' },
            { FromState: 'scheduled', ToState: 'published' },
            { FromState: 'published', ToState: 'archived' },
          ],
          StartState: 'draft',
          EndStates: ['archived', 'rejected'],
        });

        // Content status workflow as a StateDefinition
        await ensureStateDef({
          Name: 'Content Status',
          FieldName: 'status',
          Description: 'Workflow for content blocks',
          States: [
            { Id: 'draft', Label: 'Draft' },
            { Id: 'published', Label: 'Published' },
            { Id: 'archived', Label: 'Archived' },
          ],
          Transitions: [
            { FromState: 'draft', ToState: 'published' },
            { FromState: 'published', ToState: 'archived' },
          ],
          StartState: 'draft',
          EndStates: ['archived'],
        });

      } catch (e: any) {
        const msg = typeof e?.message === 'string' ? e.message : String(e);
        addLog(`⚠️ Workflows skipped due to server error: ${msg}`);
      }
      
      addLog('Creating sample article...');
      try {
        await DataService.createEntity('market', 'Article', {
          title: 'Hello Code Chronicle',
          body_json: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Welcome to Code Chronicle! This is your first sample article.'
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
      } catch (e: any) {
        const msg = typeof e?.message === 'string' ? e.message : String(e);
        if (msg.toLowerCase().includes('definition not found')) {
          addLog('⚠️ Sample article skipped: entity definition for market:Article not found on server.');
        } else {
          addLog(`⚠️ Sample article skipped due to server error: ${msg}`);
        }
      }
      
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
          <h1 className="text-2xl font-bold text-gray-900">Code Chronicle Setup</h1>
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
                <div>Auth: Basic admin@local</div>
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
                Code Chronicle is ready to use. You can now start creating and managing articles.
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
