import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  const cookieExists = cookies().get("auth_session");
  if (
    !cookieExists &&
    (pathname.startsWith("/drawings") ||
      pathname.startsWith("/editor") ||
      pathname.startsWith("/api/assets/"))
  ) {
    return NextResponse.redirect(process.env.NEXTAUTH_URL + "/");
  }
  // response.headers.append("Set-Cookie", "SameSite=None; Secure");
  // cookies().set("pathname", pathname);
  // const requestHeaders = new Headers(req.headers);
  // requestHeaders.set("x-url", req.url);
  return response;
}
