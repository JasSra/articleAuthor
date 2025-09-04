import { NextRequest, NextResponse } from 'next/server';
import { seedLookups } from '@/scripts/seed-lookups';
import { seedContent } from '@/scripts/seed-content';
import { seedForms } from '@/scripts/seed-forms';
import { seedWorkflows } from '@/scripts/seed-workflows';
import { setServerConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step, config } = body;

    // If config is provided, store it for use by seed scripts
    if (config) {
      setServerConfig(config);
    }

    switch (step) {
      case 'lookups':
        await seedLookups();
        return NextResponse.json({ success: true, message: 'Lookups seeded successfully' });
      
      case 'content':
        await seedContent();
        return NextResponse.json({ success: true, message: 'Content seeded successfully' });
      
      case 'forms':
        const formIds = await seedForms();
        return NextResponse.json({ success: true, message: 'Forms seeded successfully', data: formIds });
      
      case 'workflows':
        await seedWorkflows();
        return NextResponse.json({ success: true, message: 'Workflows seeded successfully' });
      
      case 'all':
        await seedLookups();
        await seedContent();
        const forms = await seedForms();
        await seedWorkflows();
        return NextResponse.json({ 
          success: true, 
          message: 'All seeding completed successfully',
          data: forms 
        });
      
      default:
        return NextResponse.json(
          { error: 'Invalid step parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seeding failed' },
      { status: 500 }
    );
  }
}
