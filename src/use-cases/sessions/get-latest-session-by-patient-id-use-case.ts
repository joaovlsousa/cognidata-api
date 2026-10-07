import type { SessionsRepository } from '@/database/repositories/sessions-repository'
import type { GetLatestSessionByPatientIdDto } from '@/dtos/sessions/get-latest-session-by-patient-id-dto'

export class GetLatestSessionByPatientIdUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  public async execute(
    patientId: string,
    applicatorId: string
  ): Promise<GetLatestSessionByPatientIdDto> {
    return this.sessionsRepository.getLatestByPatientId(
      patientId,
      applicatorId
    )
  }
}
