import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Adapter, Lucia } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "../prisma/prismaClient";

const PA: Adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(PA, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: ({ username, email, profileImageUrl, ...rest }) => {
    return {
      username,
      email,
      profileImageUrl,
    };
  },
});

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId)
    return {
      user: null,
      session: null,
    };

  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return {
    user,
    session,
  };
});

// IMPORTANT!
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
