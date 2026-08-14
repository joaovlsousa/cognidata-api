import bcrypt from 'bcryptjs'
import { isAfter } from 'date-fns'
import { BadRequestError } from '@/core/errors/bad-request-error'
import type { OtpCodesRepository } from '@/database/repositories/opt-codes-repository'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { ResetPasswordDto } from '@/dtos/auth/reset-password-dto'

export class ResetPasswordUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpCodesRepository: OtpCodesRepository
  ) {}

  public async execute(data: ResetPasswordDto): Promise<void> {
    const otpCode = await this.otpCodesRepository.getByEmail(data.email)

    if (!otpCode?.verified || isAfter(new Date(), otpCode.validUntil)) {
      throw new BadRequestError('Tempo expirado')
    }

    const user = await this.usersRepository.getByEmail(data.email)

    if (!user) {
      throw new BadRequestError('Tempo expirado')
    }

    const passwordHash = await bcrypt.hash(data.password, 10)
    user.password = passwordHash

    await this.usersRepository.save(user)
    await this.otpCodesRepository.deleteById(otpCode.id)
  }
}
