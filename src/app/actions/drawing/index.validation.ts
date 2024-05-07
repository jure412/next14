import { z } from "zod";

export const NewDrawingSchema = z.object({
  name: z
    .string()
    .min(1, "This field has to be filled")
    .max(16, "Max length is 16"),
  users: z
    .array(z.string())
    .refine(
      (data) =>
        data.length === 0 || data.every((item) => typeof item === "string"),
      {
        message: "Users must be an array of strings or an empty array",
      }
    ),
});
