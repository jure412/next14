import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return Response.json({
    success: true,
    msg: ["good"],
  });
};
