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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/lib/validations/forms";

const L1_OPTIONS = [
  "Bengali",
  "Hindi",
  "Spanish",
  "Mandarin Chinese",
  "Arabic",
  "Portuguese",
  "Russian",
  "Japanese",
  "Korean",
  "Vietnamese",
  "French",
  "German",
  "Turkish",
  "Urdu",
  "Tamil",
];

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAccentLab();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      nativeLanguage: "Bengali",
      englishLevel: "Intermediate",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        nativeLanguage: values.nativeLanguage,
        englishLevel: values.englishLevel,
        role: "learner",
      });
      router.replace("/onboarding");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Registration failed."
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
            href="/login"
            className="text-xs font-semibold text-[#1B4332] hover:underline dark:text-[#6EE7B7]"
          >
            Sign in →
          </Link>
        </div>
      </header>

      <div className="mx-auto flex flex-1 w-full max-w-md items-center px-4 py-6 sm:py-8">
        <div className="w-full rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 sm:p-7 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="mb-5">
            <h1 className="font-serif text-2xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
              Create account
            </h1>
            <p className="mt-1 text-xs text-[#4A4842] dark:text-[#B8B3A8]">
              Set up your learner profile to begin pronunciation calibration.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-[#B84A27] bg-[#F9ECE8] px-3.5 py-2.5 text-xs font-medium text-[#B84A27] dark:border-[rgba(244,162,97,0.35)] dark:bg-[rgba(184,74,39,0.25)] dark:text-[#F4A261]"
            >
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-3.5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="name"
                        placeholder="Aarav Rahman"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          autoComplete="new-password"
                          placeholder="At least 6 characters"
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

              <div className="grid gap-3.5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nativeLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Native language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {L1_OPTIONS.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="englishLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speaking level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Upper-intermediate">
                            Upper-intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                isLoading={form.formState.isSubmitting}
                className="w-full mt-2"
              >
                <span>Create account</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
          </Form>

          <div className="mt-5 border-t border-[#E5E0D5] pt-4 text-center text-xs text-[#4A4842] dark:border-[#2E2D29] dark:text-[#B8B3A8]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#1B4332] hover:underline dark:text-[#6EE7B7]"
            >
              Sign in
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
