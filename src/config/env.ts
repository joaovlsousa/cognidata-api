import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  HOST: z.string(),
  JWT_SECRET: z.string().min(1),
  CLIENT_APP_URL: z.url(),
  DATABASE_URL: z.url(),
})

export const env = envSchema.parse(process.env)
