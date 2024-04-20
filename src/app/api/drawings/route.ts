import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prismaClient";
import { withAuth } from "../../../../utils/auth";
import { ApiResponse } from "../types";

export const GET = withAuth(
  async (req: NextRequest & { auth: ApiResponse }) => {
    try {
      const auth = req.auth;
      if (!auth) {
        throw new Error("No user found");
      }
      const userDrawings = await prisma.userDrawing.findMany({
        where: {
          userId: auth?.data.user?.id,
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json({ msg: ["Prisma Error"], success: false });
      } else {
        return NextResponse.json({
          msg: [error.message],
          success: false,
        });
      }
    }
  }
);
