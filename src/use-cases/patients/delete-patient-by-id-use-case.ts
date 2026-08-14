import { NotFoundError } from '@/core/errors/not-found-error'
import type { PatientsRepository } from '@/database/repositories/patients-repository'

export class DeletePatientByIdUseCase {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  public async execute(patientId: string): Promise<void> {
    const patient = await this.patientsRepository.getById(patientId)

    if (!patient) {
      throw new NotFoundError('Paciente não encontrado')
    }

    await this.patientsRepository.deleteById(patientId)
  }
}
