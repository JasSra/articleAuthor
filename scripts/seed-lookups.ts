// scripts/seed-lookups.ts
import { getServerConfig } from '@/lib/config';

export async function seedLookups() {
  const config = getServerConfig();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': config.apiKey,
    'X-Client-Id': config.clientId,
  };

  try {
    // Based on swagger: POST /api/Lookup/group/{groupName}/bulk
    // First seed article statuses
    const articleStatuses = [
      { value: 'draft', label: 'Draft' },
      { value: 'submitted', label: 'Submitted' },
      { value: 'approved', label: 'Approved' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'published', label: 'Published' }
    ];

    const statusResponse = await fetch(`${config.serverUrl}/api/Lookup/group/article-status/bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify(articleStatuses)
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to seed article statuses: ${statusResponse.status} ${statusResponse.statusText}`);
    }

    // Seed article tags
    const articleTags = [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'react', label: 'React' },
      { value: 'nodejs', label: 'Node.js' },
      { value: 'api', label: 'API Development' },
      { value: 'database', label: 'Database' },
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
      { value: 'devops', label: 'DevOps' },
      { value: 'testing', label: 'Testing' }
    ];

    const tagsResponse = await fetch(`${config.serverUrl}/api/Lookup/group/article-tags/bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify(articleTags)
    });

    if (!tagsResponse.ok) {
      throw new Error(`Failed to seed article tags: ${tagsResponse.status} ${tagsResponse.statusText}`);
    }

    // Seed month tags for publication months
    const currentYear = new Date().getFullYear();
    const monthTags = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, '0');
      monthTags.push({
        value: `${currentYear}-${monthStr}`,
        label: `${new Date(currentYear, month - 1).toLocaleString('default', { month: 'long' })} ${currentYear}`
      });
    }

    const monthResponse = await fetch(`${config.serverUrl}/api/Lookup/group/month-tags/bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify(monthTags)
    });

    if (!monthResponse.ok) {
      throw new Error(`Failed to seed month tags: ${monthResponse.status} ${monthResponse.statusText}`);
    }

    console.log('✅ Lookups seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed lookups:', error);
    throw error;
  }
}

// For direct execution
if (require.main === module) {
  seedLookups().catch((e: any) => {
    console.error(e);
    process.exit(1);
  });
}