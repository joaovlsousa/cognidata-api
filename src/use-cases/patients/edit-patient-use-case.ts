import { ForbiddenError } from '@/core/errors/forbidden-error'
import { NotFoundError } from '@/core/errors/not-found-error'
import type { PatientsRepository } from '@/database/repositories/patients-repository'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { EditPatientDto } from '@/dtos/patients/edit-patient-dto'

export class EditPatientUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly patientsRepository: PatientsRepository
  ) {}

  public async execute(
    data: EditPatientDto,
    patientId: string,
    applicatorId: string
  ): Promise<void> {
    const applicator = await this.usersRepository.getById(applicatorId)

    if (!applicator || applicator.role !== 'applicator') {
      throw new ForbiddenError(
        'Você não tem permissão para realizar essa ação.'
      )
    }

    const patient = await this.patientsRepository.getById(patientId)

    if (!patient) {
      throw new NotFoundError('Paciente não encontrado')
    }

    await this.patientsRepository.save({
      ...data,
      cpf: patient.cpf,
      cpfHash: patient.cpfHash,
      id: patientId,
      applicatorId,
    })
  }
}
