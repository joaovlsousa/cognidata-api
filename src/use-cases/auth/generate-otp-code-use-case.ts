import bcrypt from 'bcryptjs'
import { addMinutes } from 'date-fns'
import { BadGatewayError } from '@/core/errors/bad-gateway-error'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { generateOtpCode } from '@/core/functions/generate-otp-code'
import { sendOtpCodeByEmail } from '@/core/functions/send-otp-code-by-email'
import type { OtpCodesRepository } from '@/database/repositories/opt-codes-repository'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { GenerateOtpCodeDto } from '@/dtos/auth/generate-otp-code-dto'

export class GenerateOtpCodeUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpCodesRepository: OtpCodesRepository
  ) {}

  public async execute(data: GenerateOtpCodeDto): Promise<void> {
    const isUserAlreadyExists = await this.usersRepository.getByEmail(
      data.email
    )

    if (!isUserAlreadyExists) {
      throw new BadRequestError(
        `Não foi possível enviar o código para o email: ${data.email}`
      )
    }

    const otpCode = await this.otpCodesRepository.getByEmail(data.email)

    if (otpCode) {
      await this.otpCodesRepository.deleteById(otpCode.id)
    }

    const code = generateOtpCode()
    const validUntil = addMinutes(new Date(), 5)
    const codeHash = await bcrypt.hash(code, 10)

    const { error } = await sendOtpCodeByEmail({
      code,
      validUntil,
      email: data.email,
    })

    if (error) {
      throw new BadGatewayError(
        `Não foi possível enviar o código para o email: ${data.email}`
      )
    }

    await this.otpCodesRepository.save({
      email: data.email,
      code: codeHash,
      validUntil,
    })
  }
}
