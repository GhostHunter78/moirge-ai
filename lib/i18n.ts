export const locales = ["en", "ge"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
