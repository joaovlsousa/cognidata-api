import bcrypt from 'bcryptjs'
import { ConflictError } from '@/core/errors/conflict-error'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { CreateAdminUserDto } from '@/dtos/users/create-admin-user-dto'
import type { CreateApplicatorUserDto } from '@/dtos/users/create-applicator-user-dto'
import type { GetUserDto } from '@/dtos/users/get-user-dto'
import type { GetUsersDto } from '@/dtos/users/get-users-dto'
import type { UpdateApplicatorUserDto } from '@/dtos/users/update-applicator-user-dto'

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async getInactiveUsers(): Promise<GetUsersDto> {
    const users = await this.usersRepository.getAllInactive()

    return {
      users,
    }
  }

  public async getProfile(userId: string): Promise<GetUserDto> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    return {
      user,
    }
  }

  public async activateUser(userId: string): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    user.isActive = true
    await this.usersRepository.save(user)
  }

  public async createAdminUser(userDto: CreateAdminUserDto): Promise<void> {
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

  public async createApplicatorUser(
    applicatorDto: CreateApplicatorUserDto
  ): Promise<void> {
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

  public async updateApplicatorUser(
    userId: string,
    applicatorDto: UpdateApplicatorUserDto
  ): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    user.name = applicatorDto.name

    await this.usersRepository.save(user)
  }
}
