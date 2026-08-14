import type { PatientsRepository } from '@/database/repositories/patients-repository'
import type { GetPatientsByApplicatorIdRequestDto } from '@/dtos/patients/get-patients-by-applicator-id-request-dto'
import type { GetPatientsByApplicatorIdResponseDto } from '@/dtos/patients/get-patients-by-applicator-id-response-dto'

export class GetPatientsByApplicatorIdUseCase {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  public async execute(
    applicatorId: string,
    options?: GetPatientsByApplicatorIdRequestDto
  ): Promise<GetPatientsByApplicatorIdResponseDto> {
    const { patients, meta } = await this.patientsRepository.getByApplicatorId(
      applicatorId,
      options
    )

    return {
      patients,
      meta,
    }
  }
}
