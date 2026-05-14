import bcrypt from 'bcryptjs'
import { addMinutes } from 'date-fns'
import { BadGatewayError } from '@/core/errors/bad-gateway-error'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { generateOtpCode } from '@/core/functions/generate-otp-code'
import { sendOtpCodeByEmail } from '@/core/functions/send-otp-code-by-email'
import type { OtpCodesRepository } from '@/database/repositories/opt-codes-repository'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { AuthRequestDto } from '@/dtos/auth/auth-request-dto'
import type { GenerateOtpCodeDto } from '@/dtos/auth/generate-otp-code-dto'
import type { GetUserDto } from '@/dtos/users/get-user-dto'

export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpCodesRepository: OtpCodesRepository
  ) {}

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

  public async generateOtpCode(data: GenerateOtpCodeDto): Promise<void> {
    const isUserAlreadyExists = await this.usersRepository.getByEmail(
      data.email
    )

    if (!isUserAlreadyExists) {
      throw new BadRequestError(
        `Não foi possível enviar o código para o email: ${data.email}`
      )
    }

    const isCodeAlreadyExists = await this.otpCodesRepository.getByEmail(
      data.email
    )

    if (isCodeAlreadyExists) {
      await this.otpCodesRepository.deleteByEmail(data.email)
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
