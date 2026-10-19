import { z } from 'zod'

export const sessionItemSkillDto = z.enum([
  'alliteration',
  'segmentation',
  'visualMemory',
  'rhyme',
  'visualMotorCoordination',
])

export const getAverageBySkillRequestDto = z.object({
  skill: sessionItemSkillDto,
})

export const getAverageBySkillResponseDto = z.object({
  items: z.array(
    z.object({
      itemIndex: z.number().int(),
      averageTheta: z.number(),
      difficulty: z.number(),
    })
  ),
})

export type GetAverageBySkillRequestDto = z.infer<
  typeof getAverageBySkillRequestDto
>
export type GetAverageBySkillResponseDto = z.infer<
  typeof getAverageBySkillResponseDto
>
