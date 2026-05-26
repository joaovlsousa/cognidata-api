import bcrypt from 'bcryptjs'
import { addMinutes, isAfter } from 'date-fns'
import { BadGatewayError } from '@/core/errors/bad-gateway-error'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { ForbiddenError } from '@/core/errors/forbidden-error'
import { generateOtpCode } from '@/core/functions/generate-otp-code'
import { sendOtpCodeByEmail } from '@/core/functions/send-otp-code-by-email'
import type { OtpCodesRepository } from '@/database/repositories/opt-codes-repository'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { AuthRequestDto } from '@/dtos/auth/auth-request-dto'
import type { GenerateOtpCodeDto } from '@/dtos/auth/generate-otp-code-dto'
import type { ResetPasswordDto } from '@/dtos/auth/reset-password-dto'
import type { VerifyOtpCodeDto } from '@/dtos/auth/verify-otp-code-dto'
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

    if (!user.isActive) {
      throw new ForbiddenError('Conta aguardando aprovação do administrador')
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

  public async verifyOtpCode(data: VerifyOtpCodeDto): Promise<void> {
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

  public async resetPassword(data: ResetPasswordDto): Promise<void> {
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
