import { randomInt } from 'node:crypto'

export function generateOtpCode(): string {
  let otpCode: string = ''

  for (let i = 0; i < 6; i++) {
    otpCode += randomInt(10).toString()
  }

  return otpCode
}
