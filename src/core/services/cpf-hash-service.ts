import crypto from 'node:crypto'
import { decryptString, encryptString } from '@47ng/cloak'
import { env } from '@/config/env'

export class CpfHashService {
  public static hash(cpf: string): string {
    return crypto
      .createHmac('sha256', env.HMAC_SECRET)
      .update(cpf)
      .digest('hex')
  }

  public static async encrypt(cpf: string): Promise<string> {
    return encryptString(cpf, env.CLOAK_SECRET)
  }

  public static decrypt(cpf: string): Promise<string> {
    return decryptString(cpf, env.CLOAK_SECRET)
  }
}
