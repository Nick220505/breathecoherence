import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create regular user
  const userPassword = await hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@example.com",
      password: userPassword,
      role: "USER",
    },
  }); // Create initial products - Platonic Solids

  const platonicSolids = await Promise.all([
    prisma.product.upsert({
      where: { id: "tetrahedron" },
      update: {},
      create: {
        id: "tetrahedron",
        name: "Tetrahedron (Fire Element)",
        description:
          "Represents transformation, spiritual growth, and personal power. The tetrahedron is associated with the element of Fire.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: "cube" },
      update: {},
      create: {
        id: "cube",
        name: "Cube (Earth Element)",
        description:
          "Symbolizes stability, grounding, and physical well-being. The cube is associated with the element of Earth.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: "octahedron" },
      update: {},
      create: {
        id: "octahedron",
        name: "Octahedron (Air Element)",
        description:
          "Associated with love, forgiveness, and compassion. The octahedron is linked to the element of Air.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: "icosahedron" },
      update: {},
      create: {
        id: "icosahedron",
        name: "Icosahedron (Water Element)",
        description:
          "Linked to joy, emotional flow, and fluidity. The icosahedron is connected to the element of Water.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: "dodecahedron" },
      update: {},
      create: {
        id: "dodecahedron",
        name: "Dodecahedron (Aether Element)",
        description:
          "Represents the universe, wisdom, and spiritual connection. The dodecahedron is associated with the element of Aether/Cosmos.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
  ]);

  const bachFlowers = await Promise.all([
    prisma.product.upsert({
      where: { id: "aspen" },
      update: {},
      create: {
        id: "aspen",
        name: "Aspen Essence",
        description: "For vague, unexplained fears.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "olive" },
      update: {},
      create: {
        id: "olive",
        name: "Olive Essence",
        description: "For exhaustion after mental or physical effort.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
  ]);

  console.log({ admin, user, platonicSolids, bachFlowers });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
