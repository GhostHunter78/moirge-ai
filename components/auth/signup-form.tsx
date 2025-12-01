"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/lib/routing";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PasswordInput from "../ui/signup-password";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";

const baseSignupSchema = z
  .object({
    username: z.string().min(1, "usernameRequired"),
    phone: z.string().min(1, "phoneRequired"),
    email: z
      .string()
      .min(1, "emailRequired")
      .email("emailInvalid"),
    password: z.string().min(8, "passwordMin"),
    repeatPassword: z.string().min(1, "repeatPasswordRequired"),
    role: z.enum(["buyer", "seller"], {
      error: "roleRequired",
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "passwordsDoNotMatch",
    path: ["repeatPassword"],
  });

export type SignupFormValues = z.infer<typeof baseSignupSchema>;

type SignupErrors = Partial<Record<keyof SignupFormValues, string>>;

export default function SignupForm({
  handleSignup,
  error,
}: {
  error: string;
  handleSignup: (values: SignupFormValues) => Promise<void> | void;
}) {
  const t = useTranslations("signup.form");

  const signupSchema = baseSignupSchema;

  const [formData, setFormData] = useState<SignupFormValues>({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "buyer",
    phone: "",
  });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const getFieldStyles = (hasError?: string) =>
    `h-12 rounded-2xl border ${
      hasError ? "border-destructive" : "border-emerald-100"
    } bg-white/80 px-4 shadow-inner shadow-emerald-50 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200`;

  const clearFieldError = (field: keyof SignupFormValues) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = name as keyof SignupFormValues;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const formattedErrors = Object.entries(fieldErrors).reduce<SignupErrors>(
        (acc, [key, messages]) => {
          if (messages && messages.length > 0) {
            const code = messages[0];
            acc[key as keyof SignupFormValues] = t(
              `errors.${code as string}`
            );
          }
          return acc;
        },
        {}
      );

      setErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    try {
      await handleSignup(result.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative w-full overflow-hidden rounded-3xl border border-emerald-100 bg-linear-to-b from-white via-white to-emerald-50/80 shadow-2xl shadow-emerald-200/60 backdrop-blur">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-2 h-40 rounded-full bg-linear-to-r from-emerald-300/60 via-teal-300/50 to-cyan-200/60 blur-3xl"
      />

      <CardHeader className="relative z-10 space-y-3 text-center">
        <CardTitle className="text-3xl font-bold text-slate-900">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 pt-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              {t("fields.usernameLabel")}
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={t("fields.usernamePlaceholder")}
              value={formData.username}
              onChange={handleChange}
              className={getFieldStyles(errors.username)}
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username}</p>
            )}
          </div>
          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              {t("fields.phoneLabel")}
            </Label>
            <PhoneInput
              country={"ge"}
              value={formData.phone}
              onChange={(phone: string) => {
                setFormData((prev) => ({ ...prev, phone }));
                if (errors.phone) {
                  clearFieldError("phone");
                }
              }}
              inputProps={{
                name: "phone",
                id: "phone",
                required: true,
                "aria-invalid": !!errors.phone,
              }}
              containerClass="w-full"
              inputClass={`!w-full h-11 rounded-md border ${
                errors.phone ? "border-destructive" : "border-input"
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("fields.emailLabel")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("fields.emailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
              className={getFieldStyles(errors.email)}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <PasswordInput
            value={formData.password}
            onChange={(password: string) => {
              setFormData((prev) => ({ ...prev, password }));
              if (errors.password) {
                clearFieldError("password");
              }
            }}
            error={errors.password}
          />
          {/* Repeat Password Field */}
          <div className="space-y-2">
            <Label htmlFor="repeatPassword" className="text-sm font-medium">
              {t("fields.confirmPasswordLabel")}
            </Label>
            <Input
              id="repeatPassword"
              name="repeatPassword"
              type="password"
              placeholder={t("fields.confirmPasswordPlaceholder")}
              value={formData.repeatPassword}
              onChange={handleChange}
              className={getFieldStyles(errors.repeatPassword)}
              aria-invalid={!!errors.repeatPassword}
            />
            {errors.repeatPassword && (
              <p className="text-xs text-destructive">
                {errors.repeatPassword}
              </p>
            )}
          </div>

          {/* Role Select */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              {t("role.label")}
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => {
                const selectedRole = value as SignupFormValues["role"];
                setFormData((prev) => ({ ...prev, role: selectedRole }));
                if (errors.role) {
                  clearFieldError("role");
                }
              }}
            >
              <SelectTrigger
                id="role"
                className="h-12 rounded-2xl border border-emerald-100 bg-white/80 px-4 text-base shadow-inner shadow-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                <SelectValue placeholder={t("role.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">
                  {t("role.buyer")}
                </SelectItem>
                <SelectItem value="seller">
                  {t("role.seller")}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/30 transition hover:brightness-105 focus-visible:ring-4 focus-visible:ring-emerald-200"
          >
            {isLoading ? t("buttons.submitting") : t("buttons.submit")}
          </Button>
          {error && (
            <p className="text-sm text-destructive text-center" role="alert">
              {t
                .optional(`apiErrors.${error}`)
                ?.() ??
                error}
            </p>
          )}
        </form>
      </CardContent>

      <CardFooter className="relative z-10 flex flex-col gap-3 border-t border-emerald-100/70 bg-white/80 pt-6 text-center">
        <p className="text-sm text-slate-500">
          {t("footer.haveAccount")}{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            {t("footer.loginHere")}
          </Link>
        </p>
        <p className="text-xs text-muted-foreground pt-2">
          {t("footer.tosPrefix")}{" "}
          <Link href="#" className="underline hover:no-underline">
            {t("footer.tos")}
          </Link>{" "}
          {t("footer.and")}{" "}
          <Link href="#" className="underline hover:no-underline">
            {t("footer.privacy")}
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          {t("footer.copyright")}
        </p>
      </CardFooter>
    </Card>
  );
}
