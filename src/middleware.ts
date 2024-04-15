import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  // Create a new response with the page name as a header
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  return response;
}
