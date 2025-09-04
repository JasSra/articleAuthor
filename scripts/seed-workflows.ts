// scripts/seed-workflows.ts
import { createServerApiClient } from '@/lib/apiClient';
import { getServerConfig } from '@/lib/config';

export async function seedWorkflows() {
  const config = getServerConfig();
  const api = createServerApiClient({
    baseUrl: config.serverUrl,
    apiKey: config.apiKey,
    clientId: config.clientId,
  });

  try {
    await api.createWorkflow({
      name: 'Article Approval Workflow',
      description: 'Standard approval process for articles',
      states: [
        {
          name: 'draft',
          label: 'Draft',
          type: 'initial',
          actions: ['submit_for_review']
        },
        {
          name: 'in_review',
          label: 'In Review',
          type: 'intermediate',
          actions: ['approve', 'request_changes', 'reject']
        },
        {
          name: 'needs_changes',
          label: 'Needs Changes',
          type: 'intermediate',
          actions: ['submit_for_review', 'withdraw']
        },
        {
          name: 'approved',
          label: 'Approved',
          type: 'intermediate',
          actions: ['publish', 'request_changes']
        },
        {
          name: 'published',
          label: 'Published',
          type: 'final',
          actions: ['archive']
        },
        {
          name: 'rejected',
          label: 'Rejected',
          type: 'final',
          actions: []
        },
        {
          name: 'archived',
          label: 'Archived',
          type: 'final',
          actions: []
        }
      ],
      transitions: [
        { from: 'draft', to: 'in_review', action: 'submit_for_review' },
        { from: 'in_review', to: 'approved', action: 'approve' },
        { from: 'in_review', to: 'needs_changes', action: 'request_changes' },
        { from: 'in_review', to: 'rejected', action: 'reject' },
        { from: 'needs_changes', to: 'in_review', action: 'submit_for_review' },
        { from: 'needs_changes', to: 'rejected', action: 'withdraw' },
        { from: 'approved', to: 'published', action: 'publish' },
        { from: 'approved', to: 'needs_changes', action: 'request_changes' },
        { from: 'published', to: 'archived', action: 'archive' }
      ]
    });

    console.log('✅ Workflows seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed workflows:', error);
    throw error;
  }
}

// For direct execution
if (require.main === module) {
  seedWorkflows().catch((e: any) => {
    console.error(e);
    process.exit(1);
  });
}
