import bcrypt from 'bcryptjs'
import { ConflictError } from '@/core/errors/conflict-error'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { CreateApplicatorUserDto } from '@/dtos/users/create-applicator-user-dto'

export class CreateApplicatorUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute(applicatorDto: CreateApplicatorUserDto): Promise<void> {
    const isSameUser = await this.usersRepository.getByEmail(
      applicatorDto.email
    )

    if (isSameUser) {
      throw new ConflictError('Este usuário já existe')
    }

    const passwordHash = await bcrypt.hash(applicatorDto.password, 10)

    await this.usersRepository.save({
      name: applicatorDto.name,
      email: applicatorDto.email,
      password: passwordHash,
      crp: applicatorDto.crp,
      role: 'applicator',
    })
  }
}
