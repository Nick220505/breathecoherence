import { PrismaClient } from '@prisma/client';

import { main as seedMain } from './seed';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany({});
  await prisma.translation.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database has been reset successfully');
}

const shouldSeed = process.argv.includes('--seed');

main()
  .then(async () => {
    if (shouldSeed) {
      console.log('Seeding the database...');
      await seedMain();
    }
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Error during database reset:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
