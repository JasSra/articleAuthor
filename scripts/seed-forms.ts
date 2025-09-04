// scripts/seed-forms.ts
import { createServerApiClient } from '@/lib/apiClient';
import { getServerConfig } from '@/lib/config';

export async function seedForms() {
  const config = getServerConfig();
  const api = createServerApiClient({
    baseUrl: config.serverUrl,
    apiKey: config.apiKey,
    clientId: config.clientId,
  });

  try {
    const articleForm = await api.createForm({
      name: 'Article Submission Form',
      schema: {
        fields: [
          {
            type: 'text',
            name: 'title',
            label: 'Article Title',
            required: true,
            order: 1
          },
          {
            type: 'textarea',
            name: 'summary',
            label: 'Article Summary',
            required: true,
            order: 2
          },
          {
            type: 'select',
            name: 'month_tag',
            label: 'Issue Month',
            required: true,
            order: 3,
            options: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06']
          },
          {
            type: 'multi-select',
            name: 'tags',
            label: 'Tags',
            required: false,
            order: 4,
            options: ['how-to', 'incident', 'analysis', 'opinion']
          }
        ]
      }
    });

    const feedbackForm = await api.createForm({
      name: 'Article Feedback Form',
      schema: {
        fields: [
          {
            type: 'radio',
            name: 'rating',
            label: 'Overall Rating',
            required: true,
            order: 1,
            options: ['1', '2', '3', '4', '5']
          },
          {
            type: 'textarea',
            name: 'comments',
            label: 'Comments',
            required: false,
            order: 2
          },
          {
            type: 'checkbox',
            name: 'recommend',
            label: 'Would you recommend this article?',
            required: false,
            order: 3
          }
        ]
      }
    });

    console.log('✅ Forms seeded successfully');
    return { articleForm: articleForm.id, feedbackForm: feedbackForm.id };
  } catch (error) {
    console.error('❌ Failed to seed forms:', error);
    throw error;
  }
}

// For direct execution
if (require.main === module) {
  seedForms().catch((e: any) => {
    console.error(e);
    process.exit(1);
  });
}
