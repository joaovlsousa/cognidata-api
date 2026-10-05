import type { SessionsRepository } from '@/database/repositories/sessions-repository'
import type { GetTotalOfSessionsByApplicatorIdDto } from '@/dtos/sessions/get-total-of-sessions-by-applicator-id-dto'

export class GetTotalOfSessionsByApplicatorIdUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  public async execute(
    applicatorId: string
  ): Promise<GetTotalOfSessionsByApplicatorIdDto> {
    const { totalOfSessions, thisMonth } =
      await this.sessionsRepository.getTotalByApplicatorId(applicatorId)

    return {
      totalOfSessions,
      thisMonth,
    }
  }
}
