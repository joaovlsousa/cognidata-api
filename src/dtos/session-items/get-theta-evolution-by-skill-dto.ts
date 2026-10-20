import { z } from 'zod'
import { sessionItemSkillDto } from './get-average-by-skill-dto'

export const getThetaEvolutionBySkillRequestDto = z.object({
  skill: sessionItemSkillDto,
})

export const getThetaEvolutionBySkillResponseDto = z.object({
  items: z.array(
    z.object({
      itemIndex: z.number().int(),
      theta: z.number(),
      difficulty: z.number(),
    })
  ),
})

export type GetThetaEvolutionBySkillRequestDto = z.infer<
  typeof getThetaEvolutionBySkillRequestDto
>
export type GetThetaEvolutionBySkillResponseDto = z.infer<
  typeof getThetaEvolutionBySkillResponseDto
>
