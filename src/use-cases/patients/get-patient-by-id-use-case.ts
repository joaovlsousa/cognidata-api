import { NotFoundError } from '@/core/errors/not-found-error'
import { CpfHashService } from '@/core/services/cpf-hash-service'
import type { PatientsRepository } from '@/database/repositories/patients-repository'
import type { GetPatientByIdDto } from '@/dtos/patients/get-patient-by-id-dto'

export class GetPatientByIdUseCase {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  public async execute(patientId: string): Promise<GetPatientByIdDto> {
    const patient = await this.patientsRepository.getById(patientId)

    if (!patient) {
      throw new NotFoundError('Paciente não encontrado')
    }

    return {
      patient: {
        ...patient,
        cpf: await CpfHashService.decrypt(patient.cpf),
      },
    }
  }
}
