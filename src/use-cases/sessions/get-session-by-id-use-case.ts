import { NotFoundError } from '@/core/errors/not-found-error'
import type { SessionsRepository } from '@/database/repositories/sessions-repository'
import type { GetSessionByIdDto } from '@/dtos/sessions/get-session-by-id-dto'

export class GetSessionByIdUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  public async execute(
    sessionId: string,
    applicatorId: string
  ): Promise<GetSessionByIdDto> {
    const session = await this.sessionsRepository.getById(
      sessionId,
      applicatorId
    )

    if (!session) {
      throw new NotFoundError('Sessão não encontrada')
    }

    return session
  }
}
