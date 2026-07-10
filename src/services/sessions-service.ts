import type { SessionsRepository } from '@/database/repositories/sessions-repository'
import type { CreateSessionRequestDto } from '@/dtos/sessions/create-session-request-dto'
import type { CreateSessionResponseDto } from '@/dtos/sessions/create-session-response-dto'

export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  public async create(
    applicatorId: string,
    sessionDto: CreateSessionRequestDto
  ): Promise<CreateSessionResponseDto> {
    const session = await this.sessionsRepository.save({
      applicatorId,
      patientId: sessionDto.patientId,
      startTime: sessionDto.startTime,
      endTime: sessionDto.endTime,
      durationInSeconds: sessionDto.durationInSeconds,
      skill: sessionDto.skill,
      countQuestion: sessionDto.countQuestion,
      score: sessionDto.score,
      percentage: sessionDto.percentage,
      thetaError: sessionDto.thetaError,
      thetaFinal: sessionDto.thetaFinal,
    })

    return {
      sessionId: session.id,
    }
  }
}
