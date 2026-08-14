import type { PatientsRepository } from '@/database/repositories/patients-repository'

export class DeletePatientsByIdListUseCase {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  public async execute(patientsIds: string[]): Promise<void> {
    await this.patientsRepository.deleteByIdList(patientsIds)
  }
}
