import {
  iteratorToStream,
  nodeStreamToIterator,
} from "@/app/helpers/functions/server";
import { createReadStream } from "fs";
import fsPromises from "fs/promises";
import mime from "mime";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { prisma } from "../../../../../prisma/prismaClient";
import { GetProps } from "../../types";

export async function GET(req: NextRequest, res: NextResponse & GetProps) {
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
    const id = res.params.id;
    const filepath = "./assets/canvas/" + id;

    const stats = await fsPromises.stat(filepath);

    const nodeStream = createReadStream(filepath);
    const stream: ReadableStream = iteratorToStream(
      nodeStreamToIterator(nodeStream)
    );
    const mimetype = mime.getType(filepath);
    return new Response(stream, {
      status: 200,
      headers: new Headers({
        "content-disposition": `attachment; filename=${path.basename(
          filepath
        )}`,
        "content-type": mimetype || "application/octet-stream",
        "content-length": stats.size + "",
        // "cache-control": "public, max-age=31536000, immutable",
      }),
    });
  } catch (error: any) {
    return NextResponse.json({
      msg: [error.message],
      success: false,
    });
  }
}
