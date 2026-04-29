import bcrypt from 'bcryptjs'
import { ConflictError } from '@/core/errors/conflict-error'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import type { CreateMasterUserDto } from '@/dtos/users/create-master-user-dto'

export class UsersService {
  private readonly usersRepository = new DrizzleUsersRepository()

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
}
