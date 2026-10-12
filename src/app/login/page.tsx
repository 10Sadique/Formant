"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginFormSchema, type LoginFormValues } from "@/lib/validations/forms";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAccentLab();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const user = await loginUser({
        email: values.email,
        password: values.password,
      });
      if (user.role === "superadmin" || user.onboardingCompleted) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding");
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Invalid email or password."
      );
    }
  };

  return (
    <div className="min-h-dvh bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6] flex flex-col justify-between">
      <header className="border-b border-[#E5E0D5] bg-[#FBF9F5] shrink-0 dark:border-[#2E2D29] dark:bg-[#111110]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45]">
              <Activity className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#141413] dark:text-[#F3EFE6]">
              Formant
            </span>
          </Link>

          <Link
            href="/register"
            className="text-xs font-semibold text-[#1B4332] hover:underline dark:text-[#6EE7B7]"
          >
            Create account →
          </Link>
        </div>
      </header>

      <div className="mx-auto flex flex-1 w-full max-w-md items-center px-4 py-6 sm:py-8">
        <div className="w-full rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="mb-5">
            <h1 className="font-serif text-2xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
              Sign in
            </h1>
            <p className="mt-1 text-xs text-[#4A4842] dark:text-[#B8B3A8]">
              Enter your email and password to continue to your studio.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-[#B84A27] bg-[#F9ECE8] px-3.5 py-2.5 text-xs font-medium text-[#B84A27] dark:border-[rgba(244,162,97,0.35)] dark:bg-[rgba(184,74,39,0.25)] dark:text-[#F4A261]"
            >
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#78756E] hover:text-[#141413] dark:text-[#9E9A90] dark:hover:text-[#F3EFE6]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                isLoading={form.formState.isSubmitting}
                className="w-full mt-2"
              >
                <span>Sign in</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
          </Form>

          <div className="mt-5 border-t border-[#E5E0D5] pt-4 text-center text-xs text-[#4A4842] dark:border-[#2E2D29] dark:text-[#B8B3A8]">
            New to Formant?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#1B4332] hover:underline dark:text-[#6EE7B7]"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#E5E0D5] py-3.5 text-center text-xs text-[#78756E] shrink-0 dark:border-[#2E2D29] dark:text-[#9E9A90]">
        Formant
      </footer>
    </div>
  );
}
