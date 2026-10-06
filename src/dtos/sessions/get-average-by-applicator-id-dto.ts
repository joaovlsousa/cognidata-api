import { z } from 'zod'

export const getAverageByApplicatorIdDto = z.object({
  average: z.object({
    alliteration: z.number().min(-3).max(3).nullable(),
    segmentation: z.number().min(-3).max(3).nullable(),
    visualMemory: z.number().min(-3).max(3).nullable(),
    rhyme: z.number().min(-3).max(3).nullable(),
  }),
})

export type GetAverageByApplicatorIdDto = z.infer<
  typeof getAverageByApplicatorIdDto
>
