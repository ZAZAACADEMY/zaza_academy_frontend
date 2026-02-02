import { z } from "zod";

type TFn = (key: string) => string;

export const getStep1Schema = (t: TFn) =>
  z
    .object({
      firstName: z.string().min(2, t("firstNameMin")),
      lastName: z.string().min(2, t("lastNameMin")),
      email: z.string().email(t("email")),
      country: z.string().min(1, t("country")),
      password: z
        .string()
        .min(8, t("passwordMin"))
        .regex(/[A-Z]/, t("passwordUpper"))
        .regex(/[0-9]/, t("passwordNumber")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMatch"),
      path: ["confirmPassword"],
    });

export const childSchema = z.object({
  name: z.string().min(1, "Child's name is required"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid age",
  }),
  gender: z.string().optional(),
  avatar: z.number(),
  program: z.string().optional(),
});
