import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

import { cookies } from "next/headers";
import { lucia } from "../../../../utils/auth";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const searchParams = url.searchParams;

    const token = searchParams.get("token");

    if (!token) {
      return Response.json({ msg: ["Missing token."], success: false });
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
      return Response.json({ msg: ["Invalid token."], success: false });
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

    return Response.redirect(new URL(process.env.NEXTAUTH_URL_INTERNAL!), 302);
  } catch (e: any) {
    return Response.json({ msg: [e.message], success: false });
  }
};