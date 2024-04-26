import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prismaClient";
import { lucia } from "../../../../../utils/auth";
interface GetProps {
  params: {
    email: string;
  };
}

export const GET = async (
  req: NextRequest,
  { params: { email } }: NextResponse & GetProps
) => {
  try {
    let sessionId: string =
      cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      throw new Error("Unauthorized");
    }
    if (!email) {
      throw new Error("No email provided");
    }
    const { user: me, session } = await lucia.validateSession(sessionId);
    if (!me || !session) {
      throw new Error("Unauthorized");
    }

    const data = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!data) {
      throw new Error("No user found with this email");
    }
    const { hashedPassword, googleId, ...user } = data;
    return NextResponse.json({
      msg: ["User found successfully"],
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json({
      msg: [error.message],
      success: false,
    });
  }
};
