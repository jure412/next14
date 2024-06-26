import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { addBlurredDataUrls } from "../../(pages)/(classic)/fn";
import { prisma } from "../../../../prisma/prismaClient";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const skip = Number(searchParams.get("skip"));
  const take = Number(searchParams.get("take"));

  try {
    if ((!skip || !take) && (isNaN(skip) || isNaN(take))) {
      throw new Error("Invalid skip or take params");
    }
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
      orderBy: {
        drawing: {
          id: "desc",
        },
      },
      skip: skip,
      take: take,
      include: {
        drawing: true,
        user: true,
      },
    });
    const userDrawingsWithBlurredUrl = await addBlurredDataUrls(
      userDrawings,
      "drawing.url"
    );
    const userDrawingCount = await prisma.userDrawing.count({
      where: {
        userId: sessionUser?.userId,
      },
    });

    if (!userDrawings) {
      throw new Error("No drawings found for this user");
    }
    return NextResponse.json({
      success: true,
      msg: ["User drawings retrieved successfully"],
      data: userDrawingsWithBlurredUrl,
      count: userDrawingCount,
    });
  } catch (error: any) {
    return NextResponse.json({
      msg: [error.message],
      success: false,
    });
  }
};
