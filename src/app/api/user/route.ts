import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lucia } from "../../../../utils/auth";

export const GET = async () => {
  try {
    let sessionId: string =
      cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      throw new Error("Unauthorized");
    }
    const { user, session } = await lucia.validateSession(sessionId);
    if (!user || !session) {
      throw new Error("Unauthorized");
    }

    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    return NextResponse.json({
      msg: ["User found."],
      success: true,
      isAuth: true,
      data: { user, session },
    });
  } catch (error) {
    return NextResponse.json({
      msg: [error.message],
      success: false,
      isAuth: false,
    });
  }
};
