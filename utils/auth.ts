import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Adapter, Lucia } from "lucia";
import { prisma } from "../prisma/prismaClient";

const PA: Adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(PA, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: ({ username, email, profileImageUrl }) => {
    return {
      username,
      email,
      profileImageUrl,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  email: string;
  profileImageUrl: string;
  emailVerified: boolean;
}
