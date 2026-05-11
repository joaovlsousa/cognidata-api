import bcrypt from 'bcryptjs'
import { BadRequestError } from '@/core/errors/bad-request-error'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { AuthRequestDto } from '@/dtos/auth/auth-request-dto'
import type { GetUserDto } from '@/dtos/users/get-user-dto'

export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async authenticateWithEmailAndPassword(
    data: AuthRequestDto
  ): Promise<GetUserDto> {
    const user = await this.usersRepository.getByEmail(data.email)

    if (!user) {
      throw new BadRequestError('E-mail ou senha inválidos')
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password)

    if (!isPasswordMatch) {
      throw new BadRequestError('E-mail ou senha inválidos')
    }

    return {
      user,
    }
  }
}
