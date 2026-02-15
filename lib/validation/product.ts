import { z } from "zod";

type TranslationFunction = (key: string) => string;

function wordCount(str: string): number {
  return str
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const STATUS_VALUES = ["active", "draft", "out_of_stock", "archived"] as const;

/** Schema for create product form. All fields required except sale price. Image validated separately. */
export function createProductSchema(t: TranslationFunction) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, t("titleRequired")),
    price: z
      .string()
      .min(1, t("priceRequired"))
      .refine(
        (v) => {
          const n = Number(v);
          return !Number.isNaN(n) && n >= 0;
        },
        { message: t("invalidPrice") },
      ),
    description: z
      .string()
      .refine(
        (v) => wordCount(v) >= 3,
        { message: t("descriptionMinWords") },
      ),
    category: z
      .string()
      .trim()
      .min(1, t("categoryRequired")),
    stock: z
      .string()
      .min(1, t("stockRequired"))
      .refine(
        (v) => {
          const n = Number(v);
          return !Number.isNaN(n) && n >= 0;
        },
        { message: t("invalidStock") },
      ),
    status: z
      .string()
      .min(1, t("statusRequired"))
      .refine(
        (v) => STATUS_VALUES.includes(v as (typeof STATUS_VALUES)[number]),
        { message: t("statusRequired") },
      ),
  });
}

export type CreateProductSchemaInput = z.infer<
  ReturnType<typeof createProductSchema>
>;

/** Schema for edit product form. Same required fields; image presence validated separately. */
export function editProductSchema(t: TranslationFunction) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, t("titleRequired")),
    price: z
      .string()
      .min(1, t("priceRequired"))
      .refine(
        (v) => {
          const n = Number(v);
          return !Number.isNaN(n) && n >= 0;
        },
        { message: t("invalidPrice") },
      ),
    description: z
      .string()
      .refine(
        (v) => wordCount(v) >= 3,
        { message: t("descriptionMinWords") },
      ),
    category: z
      .string()
      .trim()
      .min(1, t("categoryRequired")),
    stock: z
      .string()
      .min(1, t("stockRequired"))
      .refine(
        (v) => {
          const n = Number(v);
          return !Number.isNaN(n) && n >= 0;
        },
        { message: t("invalidStock") },
      ),
    status: z
      .string()
      .min(1, t("statusRequired"))
      .refine(
        (v) => STATUS_VALUES.includes(v as (typeof STATUS_VALUES)[number]),
        { message: t("statusRequired") },
      ),
  });
}

export type EditProductSchemaInput = z.infer<
  ReturnType<typeof editProductSchema>
>;

/** Flatten Zod errors into field -> message. Uses first error per path. */
export function flattenProductErrors(
  error: z.ZodError,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path[0];
    if (path && typeof path === "string" && !out[path]) {
      out[path] = issue.message;
    }
  }
  return out;
}
