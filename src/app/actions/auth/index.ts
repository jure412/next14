"use server";
import { Values } from "@/app/modules/ModalContent/index.types";
import { generateCodeVerifier, generateState } from "arctic";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { prisma } from "../../../../prisma/prismaClient";
import { lucia } from "../../../../utils/auth";
import { sendEmail } from "../../../../utils/email";
import { google } from "../../../../utils/oauth";
import {
  EmailVerificationSchema,
  SignInSchema,
  SignUpSchema,
} from "./index.validation";

export const resendVerificationEmail = async (email: string) => {
  try {
    const validationRes: any = await EmailVerificationSchema.safeParseAsync({
      email,
    });

    if (!validationRes.success) {
      const validationErrors =
        validationRes?.error?.errors.map(
          ({ message }: { message: string }) => message
        ) || [];

      return { msg: validationErrors, success: false };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("User not found.");
    }

    if (existingUser.emailVerified) {
      throw new Error("Email already verified.");
    }

    const existedCode = await prisma.emailVerification.findFirst({
      where: { userId: existingUser.id },
    });

    if (!existedCode) {
      throw new Error("Code not found.");
    }

    const sentAt = new Date(existedCode.sentAt);
    const isOneMinuteHasPassed =
      new Date().getTime() - sentAt.getTime() > 60000; // 1 minute

    if (!isOneMinuteHasPassed) {
      throw new Error(
        "Email already sent next email in " +
          (60 - Math.floor((new Date().getTime() - sentAt.getTime()) / 1000)) +
          " seconds"
      );
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
      msg: ["Email resent"],
      success: true,
    };
  } catch (error) {
    return { msg: [error.message], success: false };
  }
};

export const signUp = async (values: Values) => {
  try {
    const hashedPassword = await argon2.hash(values.password);
    const validationRes: any = await SignUpSchema.safeParseAsync({
      ...values,
    });

    if (!validationRes.success) {
      const validationErrors =
        validationRes?.error?.errors.map(
          ({ message }: { message: string }) => message
        ) || [];
      return { msg: validationErrors, success: false };
    }

    const code = Math.random().toString(36).substring(2, 8);
    const user = await prisma.user.create({
      data: {
        username: values.username,
        email: values.email,
        hashedPassword,
        emailVerification: {
          create: {
            id: generateId(15),
            code,
            sentAt: new Date(),
          },
        },
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
    return { msg: [error.message], success: false };
  }
};

export const signIn = async (values: any) => {
  try {
    const validationRes: any = await SignInSchema.safeParseAsync({
      ...values,
    });

    if (!validationRes.success) {
      const validationErrors = validationRes?.error?.errors.map(
        ({ message }: { message: string }) => message
      );
      return { msg: validationErrors, success: false };
    }

    const user = await prisma.user.findFirst({
      where: {
        email: values.email,
      },
    });

    if (!user) {
      throw new Error("Unvalid credentials");
    }

    if (!user.emailVerified) {
      throw new Error("Email not verified. Please verify your email.");
    }

    const isValidPassword = await argon2.verify(
      user?.hashedPassword!,
      values.password
    );

    if (!isValidPassword) {
      throw new Error("Unvalid credentials.");
    }
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
        sessionId: sessionCookie.value,
      },
    };
  } catch (error) {
    return { msg: [error.message], success: false };
  }
};

export const signOut = async () => {
  try {
    let sessionId: string =
      cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      throw new Error("Unauthorized");
    }

    await lucia.invalidateSession(sessionId);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      msg: ["User logged out successfully."],
    };
  } catch (error) {
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

    if (!authorizationURL) {
      throw new Error("Failed to create authorization URL.");
    }
    return {
      success: true,
      msg: ["Authorization URL created successfully."],
      data: authorizationURL.href,
    };
  } catch (error) {
    return { msg: [error?.message], success: false };
  }
};
