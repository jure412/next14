import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  const cookieExists = cookies().get("auth_session");
  if (
    !cookieExists &&
    (pathname.startsWith("/drawings") || pathname.startsWith("/api/assets/"))
  ) {
    return NextResponse.redirect(process.env.NEXTAUTH_URL_INTERNAL + "/");
  }
  return response;
}
