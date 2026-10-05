import type { PatientsRepository } from '@/database/repositories/patients-repository'
import type { GetTotalOfPatientsByApplicatorIdDto } from '@/dtos/patients/get-total-of-patients-by-applicator-id-dto'

export class GetTotalOfPatientsWithAlertByApplicatorIdUseCase {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  public async execute(
    applicatorId: string
  ): Promise<GetTotalOfPatientsByApplicatorIdDto> {
    const { totalOfPatients, thisMonth } =
      await this.patientsRepository.getTotalWithAlertByApplicatorId(
        applicatorId
      )

    return {
      totalOfPatients,
      thisMonth,
    }
  }
}
