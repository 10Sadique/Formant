import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name must be under 80 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(128, "Password must be under 128 characters."),
  nativeLanguage: z
    .string()
    .min(1, "Please select your native language."),
  englishLevel: z.enum(
    ["Beginner", "Intermediate", "Upper-intermediate", "Advanced"],
    {
      required_error: "Please select your speaking level.",
    }
  ),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const onboardingProfileSchema = z.object({
  nativeLanguage: z
    .string()
    .min(1, "Please select your native language."),
  englishLevel: z.enum(
    ["Beginner", "Intermediate", "Upper-intermediate", "Advanced"],
    {
      required_error: "Please select your current speaking level.",
    }
  ),
  dailyPracticeMinutesGoal: z.coerce
    .number()
    .int()
    .min(5, "Minimum daily goal is 5 minutes.")
    .max(60, "Maximum daily goal is 60 minutes."),
});

export type OnboardingProfileValues = z.infer<typeof onboardingProfileSchema>;

export const settingsProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name must be under 80 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
  nativeLanguage: z
    .string()
    .min(1, "Please select your native language."),
  englishLevel: z.enum(
    ["Beginner", "Intermediate", "Upper-intermediate", "Advanced"],
    {
      required_error: "Please select your speaking level.",
    }
  ),
  dailyPracticeMinutesGoal: z.coerce
    .number()
    .int()
    .min(5, "Daily goal must be between 5 and 60 minutes.")
    .max(60, "Daily goal must be between 5 and 60 minutes."),
});

export type SettingsProfileValues = z.infer<typeof settingsProfileSchema>;
