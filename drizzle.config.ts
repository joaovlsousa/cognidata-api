import { defineConfig } from 'drizzle-kit'
import { env } from './src/config/env'

export default defineConfig({
  out: './drizzle',
  schema: './src/database/drizzle/schemas/index.ts',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
