import type { SessionsRepository } from '@/database/repositories/sessions-repository'
import type { GetSessionsByPatientIdDto } from '@/dtos/sessions/get-sessions-by-patient-id-dto'

export class GetSessionsByPatientIdUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  public async execute(
    patientId: string,
    applicatorId: string
  ): Promise<GetSessionsByPatientIdDto> {
    const sessions = await this.sessionsRepository.getByPatientId(
      patientId,
      applicatorId
    )

    return { sessions }
  }
}
