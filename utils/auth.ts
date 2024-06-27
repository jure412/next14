import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Adapter, Lucia, TimeSpan } from "lucia";
import { TimeSpanUnit } from "oslo/.";
import { prisma } from "../prisma/prismaClient";

const PA: Adapter = new PrismaAdapter(prisma.session, prisma.user);

type SessionExpireProps = {
  count: number;
  unit: TimeSpanUnit;
};
export const SESSION_EXPIRE: SessionExpireProps = { count: 7, unit: "d" };
export const lucia = new Lucia(PA, {
  sessionExpiresIn: new TimeSpan(SESSION_EXPIRE.count, SESSION_EXPIRE.unit),
  sessionCookie: {
    expires: true,
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
