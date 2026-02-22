import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

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

  const sacredGeometryCategory = await prisma.category.upsert({
    where: { name: 'Sacred Geometry' },
    update: {},
    create: {
      name: 'Sacred Geometry',
      description:
        'Handcrafted geometric forms that embody universal patterns of creation.',
    },
  });

  const flowerEssenceCategory = await prisma.category.upsert({
    where: { name: 'Flower Essence' },
    update: {},
    create: {
      name: 'Flower Essence',
      description:
        'Pure, natural essences that promote emotional and spiritual well-being.',
    },
  });

  await Promise.all([
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Category',
          entityId: sacredGeometryCategory.id,
          locale: 'es',
          field: 'name',
        },
      },
      update: {},
      create: {
        entityType: 'Category',
        entityId: sacredGeometryCategory.id,
        locale: 'es',
        field: 'name',
        value: 'Geometría Sagrada',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Category',
          entityId: sacredGeometryCategory.id,
          locale: 'es',
          field: 'description',
        },
      },
      update: {},
      create: {
        entityType: 'Category',
        entityId: sacredGeometryCategory.id,
        locale: 'es',
        field: 'description',
        value:
          'Formas geométricas artesanales que encarnan patrones universales de la creación.',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Category',
          entityId: flowerEssenceCategory.id,
          locale: 'es',
          field: 'name',
        },
      },
      update: {},
      create: {
        entityType: 'Category',
        entityId: flowerEssenceCategory.id,
        locale: 'es',
        field: 'name',
        value: 'Esencia Floral',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Category',
          entityId: flowerEssenceCategory.id,
          locale: 'es',
          field: 'description',
        },
      },
      update: {},
      create: {
        entityType: 'Category',
        entityId: flowerEssenceCategory.id,
        locale: 'es',
        field: 'description',
        value:
          'Esencias naturales puras que promueven el bienestar emocional y espiritual.',
      },
    }),
  ]);

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
        categoryId: sacredGeometryCategory.id,
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
        categoryId: sacredGeometryCategory.id,
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
        categoryId: sacredGeometryCategory.id,
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
        categoryId: sacredGeometryCategory.id,
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
        categoryId: sacredGeometryCategory.id,
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
        categoryId: flowerEssenceCategory.id,
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
        categoryId: flowerEssenceCategory.id,
        stock: 100,
      },
    }),
  ]);

  const platonicSolidsTranslations = await Promise.all([
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'tetrahedron',
          locale: 'es',
          field: 'name',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'tetrahedron',
        locale: 'es',
        field: 'name',
        value: 'Tetraedro (Elemento Fuego)',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'tetrahedron',
          locale: 'es',
          field: 'description',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'tetrahedron',
        locale: 'es',
        field: 'description',
        value:
          'Representa la transformación, el crecimiento espiritual y el poder personal. El tetraedro está asociado con el elemento Fuego.',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'cube',
          locale: 'es',
          field: 'name',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'cube',
        locale: 'es',
        field: 'name',
        value: 'Cubo (Elemento Tierra)',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'cube',
          locale: 'es',
          field: 'description',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'cube',
        locale: 'es',
        field: 'description',
        value:
          'Simboliza la estabilidad, el anclaje y el bienestar físico. El cubo está asociado con el elemento Tierra.',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'octahedron',
          locale: 'es',
          field: 'name',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'octahedron',
        locale: 'es',
        field: 'name',
        value: 'Octaedro (Elemento Aire)',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'octahedron',
          locale: 'es',
          field: 'description',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'octahedron',
        locale: 'es',
        field: 'description',
        value:
          'Asociado con el amor, el perdón y la compasión. El octaedro está vinculado al elemento Aire.',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'icosahedron',
          locale: 'es',
          field: 'name',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'icosahedron',
        locale: 'es',
        field: 'name',
        value: 'Icosaedro (Elemento Agua)',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'icosahedron',
          locale: 'es',
          field: 'description',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'icosahedron',
        locale: 'es',
        field: 'description',
        value:
          'Vinculado a la alegría, el flujo emocional y la fluidez. El icosaedro está conectado con el elemento Agua.',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'dodecahedron',
          locale: 'es',
          field: 'name',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'dodecahedron',
        locale: 'es',
        field: 'name',
        value: 'Dodecaedro (Elemento Éter)',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'dodecahedron',
          locale: 'es',
          field: 'description',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'dodecahedron',
        locale: 'es',
        field: 'description',
        value:
          'Representa el universo, la sabiduría y la conexión espiritual. El dodecaedro está asociado con el elemento Éter/Cosmos.',
      },
    }),
  ]);

  const bachFlowersTranslations = await Promise.all([
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'aspen',
          locale: 'es',
          field: 'name',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'aspen',
        locale: 'es',
        field: 'name',
        value: 'Esencia de Álamo',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'aspen',
          locale: 'es',
          field: 'description',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'aspen',
        locale: 'es',
        field: 'description',
        value: 'Para miedos vagos e inexplicables.',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'olive',
          locale: 'es',
          field: 'name',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'olive',
        locale: 'es',
        field: 'name',
        value: 'Esencia de Olivo',
      },
    }),
    prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: 'Product',
          entityId: 'olive',
          locale: 'es',
          field: 'description',
        },
      },
      update: {},
      create: {
        entityType: 'Product',
        entityId: 'olive',
        locale: 'es',
        field: 'description',
        value: 'Para el agotamiento tras un esfuerzo mental o físico.',
      },
    }),
  ]);

  console.log({
    admin,
    user,
    sacredGeometryCategory,
    flowerEssenceCategory,
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
