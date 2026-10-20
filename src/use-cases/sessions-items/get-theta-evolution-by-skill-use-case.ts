import type { SessionItemsRepository } from '@/database/repositories/session-items-repository'
import type { GetThetaEvolutionBySkillResponseDto } from '@/dtos/session-items/get-theta-evolution-by-skill-dto'

export class GetThetaEvolutionBySkillUseCase {
  constructor(
    private readonly sessionItemsRepository: SessionItemsRepository
  ) {}

  public async execute(
    skill: Parameters<SessionItemsRepository['getThetaEvolutionBySkill']>[0],
    sessionId: string,
    applicatorId: string
  ): Promise<GetThetaEvolutionBySkillResponseDto> {
    const items = await this.sessionItemsRepository.getThetaEvolutionBySkill(
      skill,
      sessionId,
      applicatorId
    )

    return { items }
  }
}
