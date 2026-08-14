import bcrypt from 'bcryptjs'
import { isAfter } from 'date-fns'
import { BadRequestError } from '@/core/errors/bad-request-error'
import type { OtpCodesRepository } from '@/database/repositories/opt-codes-repository'
import type { VerifyOtpCodeDto } from '@/dtos/auth/verify-otp-code-dto'

export class VerifyOtpCodeUseCase {
  constructor(private readonly otpCodesRepository: OtpCodesRepository) {}

  public async execute(data: VerifyOtpCodeDto): Promise<void> {
    const otpCode = await this.otpCodesRepository.getByEmail(data.email)

    if (
      !otpCode ||
      otpCode.verified ||
      isAfter(new Date(), otpCode.validUntil)
    ) {
      throw new BadRequestError('Código inválido ou expirado')
    }

    const isOtpCodeMatch = await bcrypt.compare(data.code, otpCode.code)

    if (!isOtpCodeMatch) {
      throw new BadRequestError('Código inválido ou expirado')
    }

    otpCode.verified = true

    await this.otpCodesRepository.save(otpCode)
  }
}
