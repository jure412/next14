"use server";
import { Prisma } from "@prisma/client";
import { generateCodeVerifier, generateState } from "arctic";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { prisma } from "../../prisma/prismaClient";
import { lucia, validateRequest } from "../../utils/auth";
import { sendEmail } from "../../utils/email";
import { google } from "../../utils/oauth";
import { SignInSchema, SignUpSchema } from "./index.types";

export const resendVerificationEmail = async (email: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return { msg: ["User not found"], success: false };
    }

    if (existingUser.emailVerified) {
      return { msg: ["Email already verified"], success: false };
    }

    const existedCode = await prisma.emailVerification.findFirst({
      where: { userId: existingUser.id },
    });

    if (!existedCode) {
      return { msg: ["Code not found"], success: false };
    }

    const sentAt = new Date(existedCode.sentAt);
    const isOneMinuteHasPassed =
      new Date().getTime() - sentAt.getTime() > 60000; // 1 minute

    if (!isOneMinuteHasPassed) {
      return {
        msg: [
          "Email already sent next email in " +
            (60 -
              Math.floor((new Date().getTime() - sentAt.getTime()) / 1000)) +
            " seconds",
        ],
        success: false,
      };
    }

    const code = Math.random().toString(36).substring(2, 8);
    await prisma.emailVerification.update({
      where: {
        id: existedCode.id,
      },
      data: {
        code,
        sentAt: new Date(),
      },
    });

    const token = jwt.sign(
      { email, userId: existingUser.id, code },
      process.env.JWT_SECRET!,
      {
        expiresIn: "5m",
      }
    );

    const url = `${process.env.NEXTAUTH_URL_INTERNAL}/api/verify-email?token=${token}`;
    await sendEmail({
      html: `<a href="${url}">Verify your email</a>`,
      subject: "Verify your email",
      to: email,
    });

    return {
      success: true,
      msg: ["Email resent"],
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { msg: ["Prisma Error"], success: false };
    } else {
      return { msg: ["An unknown error occurred."], success: false };
    }
  }
};

export const signUp = async (values: any) => {
  const hashedPassword = await argon2.hash(values.password);
  try {
    const validationRes = await SignUpSchema.safeParseAsync({
      ...values,
    });

    if (!validationRes.success) {
      const validationErrors = validationRes.error.errors.map(
        ({ message }: { message: string }) => message
      );
      return { msg: validationErrors, success: false };
    }

    const user = await prisma.user.create({
      data: {
        username: values.username,
        email: values.email,
        hashedPassword,
      },
    });
    const code = Math.random().toString(36).substring(2, 8);
    const ev = await prisma.emailVerification.create({
      data: {
        id: generateId(15),
        code,
        userId: user.id,
        sentAt: new Date(),
      },
    });

    const token = jwt.sign(
      { email: values.email, userId: user.id, code },
      process.env.JWT_SECRET!,
      {
        expiresIn: "5m",
      }
    );

    const url = `${process.env.NEXTAUTH_URL_INTERNAL}/api/verify-email?token=${token}`;

    await sendEmail({
      html: `<a href="${url}">Verify your email</a>`,
      subject: "Verify your email",
      to: values.email,
    });

    return {
      success: true,
      msg: ["Email has been sent to you. Please verify your email."],
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { msg: ["Unvalid field"], success: false };
    } else {
      return { msg: ["An unknown error occurred."], success: false };
    }
  }
};

export const signIn = async (values: any) => {
  try {
    const validationRes = await SignInSchema.safeParseAsync({
      ...values,
    });

    if (!validationRes.success) {
      const validationErrors = validationRes.error.errors.map(
        ({ message }: { message: string }) => message
      );
      return { msg: validationErrors, success: false };
    }

    const user = await prisma.user.findFirst({
      where: {
        email: values.email,
      },
    });

    if (user) {
      if (!user.emailVerified) {
        return {
          success: false,
          msg: ["Email not verified. Please verify your email."],
        };
      }
      if (!user.hashedPassword) {
        return {
          success: false,
          msg: ["Unvalid credentials."],
        };
      }
      const isValidPassword = await argon2.verify(
        user?.hashedPassword!,
        values.password
      );
      if (isValidPassword) {
        const userId = user?.id;
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
        return {
          success: true,
          msg: ["User logged in successfully."],
          data: {
            ...user,
          },
        };
      }
    }
    return {
      success: false,
      msg: ["Unvalid credentials"],
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { msg: ["Unvalid field."], success: false };
    } else {
      return { msg: ["An unknown error occurred."], success: false };
    }
  }
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return { msg: ["Unauthorized."], success: false };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    return { msg: [error?.message], success: false };
  }
};

export const createGoogleAuthorizationURL = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });

    cookies().set("state", state, {
      httpOnly: true,
    });

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    );
    return {
      success: true,
      msg: ["Authorization URL created successfully."],
      data: authorizationURL.href,
    };
  } catch (error: any) {
    return { msg: [error?.message], success: false };
  }
};
