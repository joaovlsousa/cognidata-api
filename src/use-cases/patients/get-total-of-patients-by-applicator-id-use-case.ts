import type { PatientsRepository } from '@/database/repositories/patients-repository'
import type { GetTotalOfPatientsByApplicatorIdDto } from '@/dtos/patients/get-total-of-patients-by-applicator-id-dto'

export class GetTotalOfPatientsByApplicatorIdUseCase {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  public async execute(
    applicatorId: string
  ): Promise<GetTotalOfPatientsByApplicatorIdDto> {
    const { totalOfPatients, thisMonth } =
      await this.patientsRepository.getTotalByApplicatorId(applicatorId)

    return {
      totalOfPatients,
      thisMonth,
    }
  }
}
