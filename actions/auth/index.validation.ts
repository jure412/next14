import { z } from "zod";
import { prisma } from "../../prisma/prismaClient";

export const SignUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "This field has to be filled.")
      .email("This is not a valid email.")
      .refine(async (email: string) => {
        const user = await prisma.user.findFirst({
          where: { email },
        });
        return !user;
      }, "Email is already in use."),
    username: z.string().min(1, "This field has to be filled."),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, "This field has to be filled.")
    .email("This is not a valid email."),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const EmailVerificationSchema = z.object({
  email: z
    .string()
    .min(1, "This field has to be filled.")
    .email("This is not a valid email."),
});
