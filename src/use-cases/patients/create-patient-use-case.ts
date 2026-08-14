import { BadRequestError } from '@/core/errors/bad-request-error'
import { ForbiddenError } from '@/core/errors/forbidden-error'
import { CpfHashService } from '@/core/services/cpf-hash-service'
import type { PatientsRepository } from '@/database/repositories/patients-repository'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { CreatePatientDto } from '@/dtos/patients/create-patient-dto'

export class CreatePatientUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly patientsRepository: PatientsRepository
  ) {}

  public async execute(
    data: CreatePatientDto,
    applicatorId: string
  ): Promise<void> {
    const applicator = await this.usersRepository.getById(applicatorId)

    if (!applicator || applicator.role !== 'applicator') {
      throw new ForbiddenError(
        'Você não tem permissão para realizar essa ação.'
      )
    }

    const cpfHash = CpfHashService.hash(data.cpf)

    const patient = await this.patientsRepository.getByCpfHashAndApplicatorId(
      cpfHash,
      applicatorId
    )

    if (patient) {
      throw new BadRequestError('Este CPF já foi cadastrado.')
    }

    const cpf = await CpfHashService.encrypt(data.cpf)

    await this.patientsRepository.save({
      ...data,
      applicatorId,
      cpf,
      cpfHash,
    })
  }
}
