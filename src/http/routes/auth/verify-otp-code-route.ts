import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleOtpCodesRepository } from '@/database/drizzle/repositories/drizzle-otp-codes-repository'
import { verifyOtpCodeDto } from '@/dtos/auth/verify-otp-code-dto'
import { VerifyOtpCodeUseCase } from '@/use-cases/auth/verify-otp-code-use-case'

export const verifyOtpCodeRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth/otp-code/verify',
    {
      schema: {
        summary: 'Verificar código OTP',
        description:
          'Verifica um código de uso único para autenticação do usuário.',
        tags: ['Autenticação'],
        body: verifyOtpCodeDto,
        response: {
          204: z.void(),
          400: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const authDto = request.body

      const verifyOtpCodeUseCase = new VerifyOtpCodeUseCase(
        new DrizzleOtpCodesRepository()
      )

      await verifyOtpCodeUseCase.execute(authDto)

      return reply.status(204).send()
    }
  )
}
