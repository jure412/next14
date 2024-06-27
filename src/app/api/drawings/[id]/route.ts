import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prismaClient";
interface GetProps {
  params: {
    id: string;
  };
}

export const GET = async (
  req: NextRequest,
  { params: { id } }: NextResponse & GetProps
) => {
  try {
    const sessionId: any = cookies().get("auth_session")?.value;
    if (!sessionId) {
      throw new Error("No sessionId found");
    }
    if (!id) {
      throw new Error("No id provided");
    }
    const sessionUser = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!sessionUser) {
      throw new Error("No user found");
    }

    const userDrawings = await prisma.userDrawing.findFirst({
      where: {
        drawingId: Number(id),
        userId: sessionUser.userId,
      },
      include: {
        drawing: true,
      },
    });

    if (!userDrawings) {
      throw new Error("No drawings found for this user");
    }
    return NextResponse.json({
      success: true,
      msg: ["Successfully fetched drawing"],
      data: userDrawings.drawing,
    });
  } catch (error: any) {
    return NextResponse.json({
      msg: [error.message],
      success: false,
    });
  }
};
