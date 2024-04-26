"use server";

import { saveBase64ImageToFile } from "@/app/helpers/functions/server";
import { NewDrawingsValuesProps } from "@/app/modules/ModalContent/index.types";
import { User } from "lucia";
import { cookies } from "next/headers";
import { prisma } from "../../prisma/prismaClient";
import { NewDrawingSchema, SaveDrawingsSchema } from "./index.validation";

export const newDrawing = async ({ name, users }: NewDrawingsValuesProps) => {
  try {
    const validationRes: any = await NewDrawingSchema.safeParseAsync({
      name,
      users,
    });

    if (!validationRes.success) {
      const validationErrors = validationRes.error.errors.map(
        ({ message }: { message: string }) => message
      );
      return { msg: validationErrors, success: false };
    }

    const auth_session = cookies().get("auth_session")?.value;

    if (!auth_session) {
      throw new Error("Unauthorized");
    }

    const userSession = await prisma.session.findUnique({
      where: {
        id: auth_session,
      },
    });

    if (!userSession) {
      throw new Error("Unauthorized");
    }
    let usersId: string[] = [];
    if (users.length) {
      const foundUsers = await prisma.user.findMany({
        where: {
          email: {
            in: users,
          },
        },
      });
      if (foundUsers.length !== users.length) {
        throw new Error("User not found.");
      }
      usersId = foundUsers.map((user: User) => user.id);
    }
    usersId = [...usersId, userSession?.userId];

    const drawing = await prisma.drawing.create({
      data: {
        name: name,
        users: {
          create: usersId.map((id: string) => {
            return {
              user: {
                connect: { id },
              },
            };
          }),
        },
      },
    });
    if (!drawing) {
      throw new Error("Failed to create drawing.");
    }

    return {
      success: true,
      data: drawing,
      msg: ["Drawing created successfully."],
    };
  } catch (error) {
    return {
      success: false,
      msg: [error.message],
    };
  }
};

export const saveDrawings = async (formData: FormData) => {
  try {
    const canvas: any = formData.get("canvas");
    const drawignId = formData.get("drawingId")! as string;

    const validationRes: any = await SaveDrawingsSchema.safeParseAsync({
      canvas,
      drawignId,
    });

    if (!validationRes.success) {
      const validationErrors = validationRes.error.errors.map(
        ({ message }: { message: string }) => message
      );
      return { msg: validationErrors, success: false };
    }

    const imagePath: string | null = canvas
      ? await saveBase64ImageToFile(canvas, drawignId)
      : null;
    const drawing = await prisma.drawing.update({
      where: {
        id: drawignId as string,
      },
      data: {
        url: imagePath,
      },
    });
    return {
      success: true,
      data: drawing,
      msg: ["Drawing created successfully."],
    };
  } catch (error) {
    return {
      success: false,
      msg: [error.message],
    };
  }
};
