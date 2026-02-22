import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

config({ path: '.env.local' });

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
    seed: 'tsx src/prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
