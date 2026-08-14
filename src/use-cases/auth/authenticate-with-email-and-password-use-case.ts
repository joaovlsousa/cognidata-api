import bcrypt from 'bcryptjs'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { ForbiddenError } from '@/core/errors/forbidden-error'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { AuthRequestDto } from '@/dtos/auth/auth-request-dto'
import type { GetUserDto } from '@/dtos/users/get-user-dto'

export class AuthenticateWithEmailAndPasswordUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute(data: AuthRequestDto): Promise<GetUserDto> {
    const user = await this.usersRepository.getByEmail(data.email)

    if (!user) {
      throw new BadRequestError('E-mail ou senha inválidos')
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password)

    if (!isPasswordMatch) {
      throw new BadRequestError('E-mail ou senha inválidos')
    }

    if (!user.isActive) {
      throw new ForbiddenError('Conta aguardando aprovação do administrador')
    }

    return {
      user,
    }
  }
}
