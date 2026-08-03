import { BadRequestError } from '@/core/errors/bad-request-error'
import { ForbiddenError } from '@/core/errors/forbidden-error'
import { NotFoundError } from '@/core/errors/not-found-error'
import { parseAndValidateCsv } from '@/core/functions/parse-and-validate-csv'
import { CpfHashService } from '@/core/services/cpf-hash-service'
import type {
  PatientsRepository,
  SavePatientSchema,
} from '@/database/repositories/patients-repository'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { CreatePatientDto } from '@/dtos/patients/create-patient-dto'
import {
  type CreatePatientsFromCsvDto,
  createPatientsFromCsvDto,
} from '@/dtos/patients/create-patients-from-csv-dto'
import { createPatientsFromCsvHeadersMapDto } from '@/dtos/patients/create-patients-from-csv-headers-map-dto'
import { createPatientsFromCsvValuesMapDto } from '@/dtos/patients/create-patients-from-csv-values-map-dto'
import type { EditPatientDto } from '@/dtos/patients/edit-patient-dto'
import type { GetPatientByIdDto } from '@/dtos/patients/get-patient-by-id-dto'
import type { GetPatientsByApplicatorIdRequestDto } from '@/dtos/patients/get-patients-by-applicator-id-request-dto'
import type { GetPatientsByApplicatorIdResponseDto } from '@/dtos/patients/get-patients-by-applicator-id-response-dto'
import type { GetTotalOfPatientsByApplicatorIdDto } from '@/dtos/patients/get-total-of-patients-by-applicator-id-dto'

export class PatientsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly patientsRepository: PatientsRepository
  ) {}

  public async getByApplicatorId(
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

  public async getTotalByApplicatorId(
    applicatorId: string
  ): Promise<GetTotalOfPatientsByApplicatorIdDto> {
    const { totalOfPatients, thisMonth } =
      await this.patientsRepository.getTotalByApplicatorId(applicatorId)

    return {
      totalOfPatients,
      thisMonth,
    }
  }

  public async getById(patientId: string): Promise<GetPatientByIdDto> {
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

  public async createFromCsv(
    csvContent: string,
    applicatorId: string
  ): Promise<void> {
    const { data, invalidRows } = parseAndValidateCsv<CreatePatientsFromCsvDto>(
      csvContent,
      createPatientsFromCsvDto,
      {
        csvHeadersMap: createPatientsFromCsvHeadersMapDto,
        csvValuesMap: createPatientsFromCsvValuesMapDto,
        maxRows: 50,
      }
    )

    if (invalidRows.length) {
      throw new BadRequestError(
        `O arquivo possui as seguintes linhas inválidas: ${invalidRows.slice(0, 5)}`
      )
    }

    const patientsToInsert = new Map<string, SavePatientSchema>()
    data.forEach((row) => {
      const cpfHash = CpfHashService.hash(row.cpf)

      patientsToInsert.set(cpfHash, {
        ...row,
        cpfHash,
        applicatorId,
      })
    })

    if (patientsToInsert.size !== data.length) {
      throw new BadRequestError('O arquivo possui pacientes duplicados')
    }

    const cpfsHashList = patientsToInsert.keys().toArray()
    const existingPatients =
      await this.patientsRepository.getByCpfsHashList(cpfsHashList)

    existingPatients.forEach((patient) => {
      patientsToInsert.delete(patient.cpfHash)
    })

    if (patientsToInsert.size === 0) {
      return
    }

    const encryptedPatients = await Promise.all(
      Array.from(patientsToInsert.values()).map(async (patient) => ({
        ...patient,
        cpf: await CpfHashService.encrypt(patient.cpf),
      }))
    )

    const totalOfPatientsSaved =
      await this.patientsRepository.createMany(encryptedPatients)

    if (totalOfPatientsSaved !== encryptedPatients.length) {
      throw new BadRequestError(
        `Não foi possível salvar os pacientes. Tente novamente mais tarde.`
      )
    }
  }

  public async create(
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

  public async edit(
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

    if (data.cpf) {
      patient.cpf = await CpfHashService.encrypt(data.cpf)
      patient.cpfHash = CpfHashService.hash(data.cpf)
    }

    await this.patientsRepository.save({
      ...data,
      cpf: patient.cpf,
      cpfHash: patient.cpfHash,
      id: patientId,
      applicatorId,
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
