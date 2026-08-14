import bcrypt from 'bcryptjs'
import { ConflictError } from '@/core/errors/conflict-error'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { CreateAdminUserDto } from '@/dtos/users/create-admin-user-dto'

export class CreateAdminUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute(userDto: CreateAdminUserDto): Promise<void> {
    const isSameUser = await this.usersRepository.getByEmail(userDto.email)

    if (isSameUser) {
      throw new ConflictError('Este usuário já existe')
    }

    const passwordHash = await bcrypt.hash(userDto.password, 10)

    await this.usersRepository.save({
      role: 'admin',
      isActive: true,
      name: userDto.name,
      email: userDto.email,
      password: passwordHash,
    })
  }
}
