import type { SessionItemsRepository } from '@/database/repositories/session-items-repository'
import type { GetAverageBySkillResponseDto } from '@/dtos/session-items/get-average-by-skill-dto'

export class GetAverageBySkillUseCase {
  constructor(
    private readonly sessionItemsRepository: SessionItemsRepository
  ) {}

  public async execute(
    skill: Parameters<SessionItemsRepository['getAverageBySkill']>[0],
    applicatorId: string
  ): Promise<GetAverageBySkillResponseDto> {
    const items = await this.sessionItemsRepository.getAverageBySkill(
      skill,
      applicatorId
    )

    return { items }
  }
}
