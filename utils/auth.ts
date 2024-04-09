import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Adapter, Lucia } from "lucia";
import { prisma } from "../prisma/prismaClient";
const PA: Adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(PA, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
