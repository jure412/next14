import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prismaClient";
import { lucia } from "../../../../../utils/auth";
import { google } from "../../../../../utils/oauth";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return Response.json({ msg: ["Invalid request"], success: false });
    }

    const codeVerifier = cookies().get("codeVerifier")?.value;
    const savedState = cookies().get("state")?.value;

    console.log({ codeVerifier, savedState, state });

    if (!codeVerifier || !savedState) {
      return Response.json({
        msg: ["Code verifier or saved state is not exists"],
        success: false,
      });
    }

    if (savedState !== state) {
      return Response.json({
        msg: ["State does not match"],
        success: false,
      });
    }

    const { accessToken, idToken, accessTokenExpiresAt, refreshToken } =
      await google.validateAuthorizationCode(code, codeVerifier);

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
      }
    );

    const googleData = (await googleRes.json()) as GoogleUser;

    let userId: string = "";
    console.log("google data", googleData);
    await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findFirst({
        where: { email: googleData.email },
      });
      if (!user) {
        const createdUser = await prisma.user.create({
          data: {
            email: googleData.email,
            username: googleData.name,
            profileImageUrl: googleData.picture,
            emailVerified: true,
          },
        });

        userId = createdUser.id;
        if (!createdUser) {
          throw new Error("Failed to create user");
        }
      } else {
        userId = user.id;
        if (!user.emailVerified) {
          const updateUser = await prisma.user.update({
            where: { id: userId },
            data: {
              emailVerified: true,
            },
          });
          if (!updateUser) {
            throw new Error("Failed to update updateUser");
          }
        }
      }

      const Oauth = await prisma.oAauth.findUnique({
        where: { id: googleData.id },
      });
      if (Oauth) {
        const updatedOAuthAccount = await prisma.oAauth.update({
          where: { id: googleData.id },
          data: {
            accessToken,
            expiresAt: accessTokenExpiresAt,
            refreshToken: refreshToken ?? "",
          },
        });

        if (!updatedOAuthAccount) {
          throw new Error("Failed to update OAuthAccountRes");
        }
      } else {
        const createdOAuthAccount = await prisma.oAauth.create({
          data: {
            accessToken,
            expiresAt: accessTokenExpiresAt,
            id: googleData.id,
            provider: "google",
            refreshToken: refreshToken ?? "",
            providerUserId: googleData.id,
            userId: userId,
          },
        });

        if (!createdOAuthAccount) {
          throw new Error("Failed to create OAuthAccountRes");
        }
      }
    });

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);

    const session = await lucia.createSession(userId, {
      expiresAt: currentDate,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    cookies().set("state", "", {
      expires: new Date(0),
    });
    cookies().set("codeVerifier", "", {
      expires: new Date(0),
    });

    return NextResponse.redirect(
      new URL("/", process.env.NEXTAUTH_URL_INTERNAL),
      {
        status: 302,
      }
    );
  } catch (error: any) {
    return Response.json({
      msg: [error.message],
      success: false,
    });
  }
};
