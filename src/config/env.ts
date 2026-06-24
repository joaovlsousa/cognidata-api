import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  HOST: z.string(),
  JWT_SECRET: z.string().min(1),
  COOKIES_SECRET: z.string().min(1),
  DATABASE_URL: z.url(),
  RESEND_API_KEY: z.string(),
  MAIL_DOMAIN: z.string(),
})

export const env = envSchema.parse(process.env)
