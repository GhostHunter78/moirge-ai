"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
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

const signupSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    repeatPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["buyer", "seller"], {
      error: "Please choose a role",
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

type SignupErrors = Partial<Record<keyof SignupFormValues, string>>;

export default function SignupForm({
  handleSignup,
  error,
}: {
  error: string;
  handleSignup: (values: SignupFormValues) => Promise<void> | void;
}) {
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
            acc[key as keyof SignupFormValues] = messages[0];
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">Create Account</CardTitle>
        <CardDescription>
          Join our marketplace and start selling or buying today
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`h-11 ${errors.username ? "border-destructive" : ""}`}
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username}</p>
            )}
          </div>
          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
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
              inputClass={`w-full h-11 rounded-md border ${
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
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`h-11 ${errors.email ? "border-destructive" : ""}`}
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
              Confirm Password
            </Label>
            <Input
              id="repeatPassword"
              name="repeatPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.repeatPassword}
              onChange={handleChange}
              className={`h-11 ${
                errors.repeatPassword ? "border-destructive" : ""
              }`}
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
              I want to
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
              <SelectTrigger id="role">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buy products</SelectItem>
                <SelectItem value="seller">Sell products</SelectItem>
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
            className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          {error && (
            <p className="text-sm text-destructive text-center" role="alert">
              {error}
            </p>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t pt-6">
        <p className="text-xs text-muted-foreground text-center w-full">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Login here
          </Link>
        </p>
        <p className="text-xs text-muted-foreground text-center w-full pt-2">
          By signing up, you agree to our{" "}
          <Link href="#" className="underline hover:no-underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:no-underline">
            Privacy Policy
          </Link>
        </p>
        <p className="text-xs text-muted-foreground text-center w-full">
          Moirge © 2025 All rights reserved.
        </p>
      </CardFooter>
    </Card>
  );
}
