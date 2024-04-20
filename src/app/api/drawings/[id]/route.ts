import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prismaClient";
import { withAuth } from "../../../../../utils/auth";
import { ApiResponse } from "../../types";
interface GetProps {
  params: {
    id: string;
  };
}

export const GET = withAuth(
  async (
    req: NextRequest & { auth: ApiResponse },
    { params: { id } }: NextResponse & GetProps
  ) => {
    try {
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
