import bcrypt from 'bcryptjs'
import { ConflictError } from '@/core/errors/conflict-error'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { CreateAdminUserDto } from '@/dtos/users/create-admin-user-dto'
import type { CreateMasterUserDto } from '@/dtos/users/create-master-user-dto'

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async createMasterUser(userDto: CreateMasterUserDto): Promise<void> {
    const isSameUser = await this.usersRepository.getByEmail(userDto.email)

    if (isSameUser) {
      throw new ConflictError('Este usuário já existe')
    }

    const passwordHash = await bcrypt.hash(userDto.password, 10)

    await this.usersRepository.save({
      name: userDto.name,
      email: userDto.email,
      password: passwordHash,
      role: 'master',
    })
  }

  public async createAdminUser(userDto: CreateAdminUserDto): Promise<void> {
    const isSameUser = await this.usersRepository.getByEmail(userDto.email)

    if (isSameUser) {
      throw new ConflictError('Este usuário já existe')
    }

    const passwordHash = await bcrypt.hash(userDto.password, 10)

    await this.usersRepository.save({
      name: userDto.name,
      email: userDto.email,
      password: passwordHash,
      cpf: userDto.cpf,
      contactPhone: userDto.contactPhone,
      institution: userDto.institution,
      role: 'admin',
    })
  }
}
