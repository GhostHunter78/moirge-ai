import { z } from "zod";

type TranslationFunction = (key: string) => string;

export const loginSchema = (t: TranslationFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t("login.errors.emailRequired"))
      .email(t("login.errors.emailInvalid")),
    password: z.string().min(1, t("login.errors.passwordRequired")),
  });

export type LoginInput = z.infer<ReturnType<typeof loginSchema>>;
