import bcrypt from 'bcryptjs'
import { getDomain } from 'tldts'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { ConflictError } from '@/core/errors/conflict-error'
import { ForbiddenError } from '@/core/errors/forbidden-error'
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

  public async createApplicatorUser(
    adminId: string,
    applicatorDto: CreateApplicatorUserDto
  ): Promise<void> {
    const admin = await this.usersRepository.getById(adminId)

    if (!admin) {
      throw new ForbiddenError(
        'Você não tem permissão para realizar essa ação.'
      )
    }

    const isSameUser = await this.usersRepository.getByEmail(
      applicatorDto.email
    )

    if (isSameUser) {
      throw new ConflictError('Este usuário já existe')
    }

    const adminMailDomain = getDomain(admin.email)
    const applicatorMailDomain = getDomain(applicatorDto.email)

    if (
      !adminMailDomain ||
      !applicatorMailDomain ||
      adminMailDomain !== applicatorMailDomain
    ) {
      throw new BadRequestError(
        'O E-mail do aplicador não pertence a sua instituição'
      )
    }

    const passwordHash = await bcrypt.hash(applicatorDto.password, 10)

    await this.usersRepository.save({
      name: applicatorDto.name,
      email: applicatorDto.email,
      password: passwordHash,
      cpf: applicatorDto.cpf,
      contactPhone: applicatorDto.contactPhone,
      academicBackground: applicatorDto.academicBackground,
      institution: admin.institution,
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
    user.contactPhone = applicatorDto.contactPhone
    user.academicBackground = applicatorDto.academicBackground

    await this.usersRepository.save(user)
  }
}
