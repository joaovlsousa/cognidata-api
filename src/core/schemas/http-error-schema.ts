import { z } from 'zod'

export const httpErrorSchema = z.object({
  message: z.string(),
})
