// scripts/seed-content.ts
import { createServerApiClient } from '@/lib/apiClient';
import { getServerConfig } from '@/lib/config';

export async function seedContent() {
  const config = getServerConfig();
  const api = createServerApiClient({
    baseUrl: config.serverUrl,
    apiKey: config.apiKey,
    clientId: config.clientId,
  });

  try {
    await api.createContent({
      type: 'hero',
      placeholder: 'home-hero',
      data: {
        title: 'Code Chronicle',
        subtitle: 'Write. Read. Inspire.',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop'
      }
    });

    await api.createContent({
      type: 'showcase',
      placeholder: 'home-showcase',
      data: []
    });

    await api.createContent({
      type: 'text',
      placeholder: 'about-text',
      data: {
        content: 'Code Chronicle is a vibrant community where writers, bloggers, and content creators share their stories, inspire readers, and connect with fellow storytellers.'
      }
    });

    console.log('✅ Content seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed content:', error);
    throw error;
  }
}

// For direct execution
if (require.main === module) {
  seedContent().catch((e: any) => {
    console.error(e);
    process.exit(1);
  });
}
