import { z } from "zod";

export const NewDrawingSchema = z.object({
  name: z.string().min(1, "This field has to be filled"),
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
