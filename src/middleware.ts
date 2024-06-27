import { verifyRequestOrigin } from "lucia";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const originHeader = req.nextUrl.origin;
  const hostHeader = req.nextUrl.host;
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  const pathname = req.nextUrl.pathname;
  const cookieExists = req.cookies?.get("auth_session")?.value;

  if (
    !cookieExists &&
    (pathname.startsWith("/drawings") ||
      pathname.startsWith("/editor") ||
      pathname.startsWith("/api/assets/"))
  ) {
    return NextResponse.redirect(process.env.APP_URL + "/");
  }

  return NextResponse.next();
}
