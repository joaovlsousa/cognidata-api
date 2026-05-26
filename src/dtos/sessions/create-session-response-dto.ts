import { z } from 'zod'

export const createSessionResponseDto = z.object({
  sessionId: z.uuid(),
})

export type CreateSessionResponseDto = z.infer<typeof createSessionResponseDto>
