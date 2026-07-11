import { ForbiddenError } from '@/core/errors/forbidden-error'
import { NotFoundError } from '@/core/errors/not-found-error'
import type { PatientsRepository } from '@/database/repositories/patients-repository'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { GetAllPatientsByApplicatorIdDto } from '@/dtos/patients/get-all-patients-by-applicator-id-dto'
import type { GetPatientByIdDto } from '@/dtos/patients/get-patient-by-id-dto'
import type { SavePatientDto } from '@/dtos/patients/save-patient-dto'

export class PatientsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly patientsRepository: PatientsRepository
  ) {}

  public async getAllByApplicatorId(
    applicatorId: string
  ): Promise<GetAllPatientsByApplicatorIdDto> {
    const patients =
      await this.patientsRepository.getAllByApplicatorId(applicatorId)

    return {
      patients,
    }
  }

  public async getById(patientId: string): Promise<GetPatientByIdDto> {
    const patient = await this.patientsRepository.getById(patientId)

    if (!patient) {
      throw new NotFoundError('Paciente não encontrado')
    }

    return {
      patient,
    }
  }

  public async save(
    data: SavePatientDto,
    applicatorId: string,
    patientId?: string
  ): Promise<void> {
    const applicator = await this.usersRepository.getById(applicatorId)

    if (!applicator || applicator.role !== 'applicator') {
      throw new ForbiddenError(
        'Você não tem permissão para realizar essa ação.'
      )
    }

    await this.patientsRepository.save({
      id: patientId,
      applicatorId,
      name: data.name,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      patientResponsibleName: data.patientResponsibleName,
      patientResponsibleEmail: data.patientResponsibleEmail,
      patientResponsibleKinship: data.patientResponsibleKinship,
      patientResponsiblePhone: data.patientResponsiblePhone,
      schoolName: data.schoolName,
      schoolYear: data.schoolYear,
      schoolSchedule: data.schoolSchedule,
      medicalChiefComplaint: data.medicalChiefComplaint,
      medicalObservations: data.medicalObservations,
    })
  }

  public async deleteById(patientId: string): Promise<void> {
    const patient = await this.patientsRepository.getById(patientId)

    if (!patient) {
      throw new NotFoundError('Paciente não encontrado')
    }

    await this.patientsRepository.deleteById(patientId)
  }
}
