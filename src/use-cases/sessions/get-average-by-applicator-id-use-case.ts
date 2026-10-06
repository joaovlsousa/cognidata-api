import type { SessionsRepository } from '@/database/repositories/sessions-repository'
import type { GetAverageByApplicatorIdDto } from '@/dtos/sessions/get-average-by-applicator-id-dto'

export class GetAverageByApplicatorIdUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  public async execute(
    applicatorId: string
  ): Promise<GetAverageByApplicatorIdDto> {
    const average =
      await this.sessionsRepository.getAverageByApplicatorId(applicatorId)

    return {
      average,
    }
  }
}
