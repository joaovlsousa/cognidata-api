import { BadRequestError } from '@/core/errors/bad-request-error'
import { parseAndValidateCsv } from '@/core/functions/parse-and-validate-csv'
import { CpfHashService } from '@/core/services/cpf-hash-service'
import type {
  PatientsRepository,
  SavePatientSchema,
} from '@/database/repositories/patients-repository'
import {
  type CreatePatientsFromCsvDto,
  createPatientsFromCsvDto,
} from '@/dtos/patients/create-patients-from-csv-dto'
import { createPatientsFromCsvHeadersMapDto } from '@/dtos/patients/create-patients-from-csv-headers-map-dto'
import { createPatientsFromCsvValuesMapDto } from '@/dtos/patients/create-patients-from-csv-values-map-dto'

export class CreatePatientsFromCsvUseCase {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  public async execute(
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
}
