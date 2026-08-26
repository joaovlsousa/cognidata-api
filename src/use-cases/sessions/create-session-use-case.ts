import { ForbiddenError } from '@/core/errors/forbidden-error'
import type { PatientsRepository } from '@/database/repositories/patients-repository'
import type { SessionsRepository } from '@/database/repositories/sessions-repository'
import type { CreateSessionRequestDto } from '@/dtos/sessions/create-session-request-dto'
import type { CreateSessionResponseDto } from '@/dtos/sessions/create-session-response-dto'

export class CreateSessionUseCase {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly patientsRepository: PatientsRepository
  ) {}

  public async execute(
    applicatorId: string,
    sessionDto: CreateSessionRequestDto
  ): Promise<CreateSessionResponseDto> {
    const patient = await this.patientsRepository.getById(sessionDto.patientId)

    if (!patient) {
      throw new ForbiddenError()
    }

    const session = await this.sessionsRepository.save({
      applicatorId,
      ...sessionDto,
    })

    if (patient.status === 'pending') {
      patient.status = 'active'

      await this.patientsRepository.save(patient)
    }

    return {
      sessionId: session.id,
    }
  }
}
