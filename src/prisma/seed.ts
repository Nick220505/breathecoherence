import { PrismaClient, ProductType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const SACRED_GEOMETRY_PRICE = 29.99;
const FLOWER_ESSENCE_PRICE = 19.99;

export async function main() {
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const userPassword = await hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    },
  });

  const platonicSolids = await Promise.all([
    prisma.product.upsert({
      where: { id: 'tetrahedron' },
      update: {},
      create: {
        id: 'tetrahedron',
        name: 'Tetrahedron (Fire Element)',
        description:
          'Represents transformation, spiritual growth, and personal power. The tetrahedron is associated with the element of Fire.',
        price: SACRED_GEOMETRY_PRICE,
        type: ProductType.SACRED_GEOMETRY,
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: 'cube' },
      update: {},
      create: {
        id: 'cube',
        name: 'Cube (Earth Element)',
        description:
          'Symbolizes stability, grounding, and physical well-being. The cube is associated with the element of Earth.',
        price: SACRED_GEOMETRY_PRICE,
        type: ProductType.SACRED_GEOMETRY,
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: 'octahedron' },
      update: {},
      create: {
        id: 'octahedron',
        name: 'Octahedron (Air Element)',
        description:
          'Associated with love, forgiveness, and compassion. The octahedron is linked to the element of Air.',
        price: SACRED_GEOMETRY_PRICE,
        type: ProductType.SACRED_GEOMETRY,
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: 'icosahedron' },
      update: {},
      create: {
        id: 'icosahedron',
        name: 'Icosahedron (Water Element)',
        description:
          'Linked to joy, emotional flow, and fluidity. The icosahedron is connected to the element of Water.',
        price: SACRED_GEOMETRY_PRICE,
        type: ProductType.SACRED_GEOMETRY,
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: 'dodecahedron' },
      update: {},
      create: {
        id: 'dodecahedron',
        name: 'Dodecahedron (Aether Element)',
        description:
          'Represents the universe, wisdom, and spiritual connection. The dodecahedron is associated with the element of Aether/Cosmos.',
        price: SACRED_GEOMETRY_PRICE,
        type: ProductType.SACRED_GEOMETRY,
        stock: 50,
      },
    }),
  ]);

  const bachFlowers = await Promise.all([
    prisma.product.upsert({
      where: { id: 'aspen' },
      update: {},
      create: {
        id: 'aspen',
        name: 'Aspen Essence',
        description: 'For vague, unexplained fears.',
        price: FLOWER_ESSENCE_PRICE,
        type: ProductType.FLOWER_ESSENCE,
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: 'olive' },
      update: {},
      create: {
        id: 'olive',
        name: 'Olive Essence',
        description: 'For exhaustion after mental or physical effort.',
        price: FLOWER_ESSENCE_PRICE,
        type: ProductType.FLOWER_ESSENCE,
        stock: 100,
      },
    }),
  ]);

  const platonicSolidsTranslations = await Promise.all([
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId: 'tetrahedron', locale: 'es' } },
      update: {},
      create: {
        productId: 'tetrahedron',
        locale: 'es',
        name: 'Tetraedro (Elemento Fuego)',
        description:
          'Representa la transformación, el crecimiento espiritual y el poder personal. El tetraedro está asociado con el elemento Fuego.',
      },
    }),
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId: 'cube', locale: 'es' } },
      update: {},
      create: {
        productId: 'cube',
        locale: 'es',
        name: 'Cubo (Elemento Tierra)',
        description:
          'Simboliza la estabilidad, el anclaje y el bienestar físico. El cubo está asociado con el elemento Tierra.',
      },
    }),
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId: 'octahedron', locale: 'es' } },
      update: {},
      create: {
        productId: 'octahedron',
        locale: 'es',
        name: 'Octaedro (Elemento Aire)',
        description:
          'Asociado con el amor, el perdón y la compasión. El octaedro está vinculado al elemento Aire.',
      },
    }),
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId: 'icosahedron', locale: 'es' } },
      update: {},
      create: {
        productId: 'icosahedron',
        locale: 'es',
        name: 'Icosaedro (Elemento Agua)',
        description:
          'Vinculado a la alegría, el flujo emocional y la fluidez. El icosaedro está conectado con el elemento Agua.',
      },
    }),
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId: 'dodecahedron', locale: 'es' } },
      update: {},
      create: {
        productId: 'dodecahedron',
        locale: 'es',
        name: 'Dodecaedro (Elemento Éter)',
        description:
          'Representa el universo, la sabiduría y la conexión espiritual. El dodecaedro está asociado con el elemento Éter/Cosmos.',
      },
    }),
  ]);

  const bachFlowersTranslations = await Promise.all([
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId: 'aspen', locale: 'es' } },
      update: {},
      create: {
        productId: 'aspen',
        locale: 'es',
        name: 'Esencia de Álamo',
        description: 'Para miedos vagos e inexplicables.',
      },
    }),
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId: 'olive', locale: 'es' } },
      update: {},
      create: {
        productId: 'olive',
        locale: 'es',
        name: 'Esencia de Olivo',
        description: 'Para el agotamiento tras un esfuerzo mental o físico.',
      },
    }),
  ]);

  console.log({
    admin,
    user,
    platonicSolids,
    bachFlowers,
    platonicSolidsTranslations,
    bachFlowersTranslations,
  });
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect().catch((e) => {
        console.error('Error disconnecting from database:', e);
      });
    });
}
