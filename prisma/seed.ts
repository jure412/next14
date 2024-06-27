import * as argon2 from "argon2";
import { prisma } from "./prismaClient";

async function main() {
  console.log("Seeding database...");

  const user = await prisma.user.findUnique({
    where: {
      email: "jc-playground@gmail.com",
    },
  });
  if (!user) {
    const password = "12345678";
    const hashedPassword = await argon2.hash(password);
    const user1 = await prisma.user.create({
      data: {
        email: "jc-playground@gmail.com",
        hashedPassword,
        username: "jc-playground",
        emailVerified: true,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: "jc-playground+1@gmail.com",
        hashedPassword,
        username: "jc-playground+1",
        emailVerified: true,
      },
    });

    // Create 100 drawings
    for (let i = 0; i < 100; i++) {
      await prisma.drawing.create({
        data: {
          name: `Drawing ${i}`,
          url: "",
          users: {
            create: [
              {
                userId: user1.id,
              },
              {
                userId: user2.id,
              },
            ],
          },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
