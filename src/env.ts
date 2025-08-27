import { z } from "zod";

const envSchema = z.object({
  // Variables existantes
  GEMINI_API_KEY: z.string().optional(),
  WEATHERAPI_KEY: z.string().optional(),
  NEXT_PUBLIC_WEATHERAPI_KEY: z.string().optional(),
  OPENWEATHERMAP_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  
  // Configuration SMTP pour Gmail
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  CONTACT_EMAIL: z.string().email().optional(),
});

export const env = envSchema.parse({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  WEATHERAPI_KEY: process.env.WEATHERAPI_KEY,
  NEXT_PUBLIC_WEATHERAPI_KEY: process.env.NEXT_PUBLIC_WEATHERAPI_KEY,
  OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
});