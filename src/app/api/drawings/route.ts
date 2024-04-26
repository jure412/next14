import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prismaClient";

export const GET = async () => {
  try {
    const sessionId: any = cookies().get("auth_session")?.value;
    if (!sessionId) {
      throw new Error("No sessionId found");
    }
    const sessionUser = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!sessionUser) {
      throw new Error("No user found");
    }
    const userDrawings = await prisma.userDrawing.findMany({
      where: {
        userId: sessionUser?.userId,
      },
      include: {
        drawing: true,
        user: true,
      },
    });
    if (!userDrawings) {
      throw new Error("No drawings found for this user");
    }
    return NextResponse.json({
      success: true,
      msg: ["User drawings retrieved successfully"],
      data: userDrawings,
    });
  } catch (error) {
    return NextResponse.json({
      msg: [error.message],
      success: false,
    });
  }
};
