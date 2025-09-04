// scripts/seed-all.ts
import { seedLookups } from './seed-lookups';
import { seedContent } from './seed-content';
import { seedForms } from './seed-forms';
import { seedWorkflows } from './seed-workflows';

async function main() {
  console.log('🌱 Starting complete seeding process...');
  
  try {
    console.log('\n1/4 Seeding lookups...');
    await seedLookups();
    
    console.log('\n2/4 Seeding content...');
    await seedContent();
    
    console.log('\n3/4 Seeding forms...');
    await seedForms();
    
    console.log('\n4/4 Seeding workflows...');
    await seedWorkflows();
    
    console.log('\n✅ Complete seeding process finished successfully!');
  } catch (error) {
    console.error('\n❌ Seeding process failed:', error);
    throw error;
  }
}

if (require.main === module) {
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}

export { main as seedAll };
