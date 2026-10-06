import type { SessionsRepository } from '@/database/repositories/sessions-repository'
import type { GetSessionsByApplicatorIdRequestDto } from '@/dtos/sessions/get-sessions-by-applicator-id-request-dto'
import type { GetSessionsByApplicatorIdResponseDto } from '@/dtos/sessions/get-sessions-by-applicator-id-response-dto'

export class GetSessionsByApplicatorIdUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  public async execute(
    applicatorId: string,
    options?: GetSessionsByApplicatorIdRequestDto
  ): Promise<GetSessionsByApplicatorIdResponseDto> {
    const { sessions, meta } = await this.sessionsRepository.getByApplicatorId(
      applicatorId,
      options
    )

    return {
      sessions: sessions,
      meta,
    }
  }
}
