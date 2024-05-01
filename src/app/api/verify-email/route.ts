import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

import { cookies } from "next/headers";
import { prisma } from "../../../../prisma/prismaClient";
import { lucia } from "../../../../utils/auth";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      throw new Error("Missing token.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      code: string;
      userId: string;
    };

    const emailVerificationQueryResult =
      await prisma.emailVerification.findFirst({
        where: {
          userId: decoded.userId,
          code: decoded.code,
        },
      });

    if (!emailVerificationQueryResult) {
      throw new Error("Invalid token.");
    }
    await prisma.emailVerification.delete({
      where: {
        id: emailVerificationQueryResult.id,
      },
    });

    await prisma.user.update({
      where: {
        email: decoded.email,
      },
      data: {
        emailVerified: true,
      },
    });

    const userId = decoded?.userId;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    const session = await lucia.createSession(userId, {
      expiresAt: currentDate,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return Response.redirect(new URL(process.env.NEXTAUTH_URL!), 302);
  } catch (error: any) {
    return Response.json({ msg: [error.message], success: false });
  }
};
