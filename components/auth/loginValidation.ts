import { z } from "zod";

type TFn = (key: string) => string;

export const getLoginSchema = (t: TFn) =>
  z.object({
    email: z.string().email(t("errors.email")),
    password: z.string().min(1, t("errors.password")),
  });
