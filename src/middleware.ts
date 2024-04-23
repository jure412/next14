import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  response.headers.set("x-pathname", pathname);
  return response;
}
