import { ForbiddenError } from '@/core/errors/forbidden-error'
import type { StudentsRepository } from '@/database/repositories/students-repository'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { CreateStudentDto } from '@/dtos/students/create-student-dto'

export class StudentsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly studentsRepository: StudentsRepository
  ) {}

  public async create(
    data: CreateStudentDto,
    applicatorId: string
  ): Promise<void> {
    const applicator = await this.usersRepository.getById(applicatorId)

    if (
      !applicator ||
      applicator.role !== 'applicator' ||
      !applicator.institution
    ) {
      throw new ForbiddenError(
        'Você não tem permissão para realizar essa ação.'
      )
    }

    await this.studentsRepository.save({
      applicatorId,
      name: data.name,
      birthDate: data.birthDate,
      gender: data.gender,
      grade: data.grade,
      institution: applicator.institution,
    })
  }
}
