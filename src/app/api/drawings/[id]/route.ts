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
    const sessionUser = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!sessionUser) {
      throw new Error("No user found");
    }

    if (!id) {
      throw new Error("No id provided");
    }
    const userDrawings = await prisma.drawing.findUnique({
      where: {
        id: id,
      },
      include: {
        users: true,
      },
    });

    if (!userDrawings) {
      throw new Error("Drawing not found for this user");
    }

    return NextResponse.json({
      success: true,
      msg: ["User drawings retrieved successfully"],
      data: userDrawings,
    });
  } catch (error: any) {
    return NextResponse.json({
      msg: [error.message],
      success: false,
    });
  }
};
