import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { sessionsTable } from '@/database/drizzle/schemas'

const sessionDto = createSelectSchema(sessionsTable)

export const getLatestSessionByPatientIdDto = z.object({
  alliteration: sessionDto.nullable(),
  segmentation: sessionDto.nullable(),
  visualMemory: sessionDto.nullable(),
  rhyme: sessionDto.nullable(),
})

export type GetLatestSessionByPatientIdDto = z.infer<
  typeof getLatestSessionByPatientIdDto
>
