import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleOtpCodesRepository } from '@/database/drizzle/repositories/drizzle-otp-codes-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { generateOtpCodeDto } from '@/dtos/auth/generate-otp-code-dto'
import { GenerateOtpCodeUseCase } from '@/use-cases/auth/generate-otp-code-use-case'

export const generateOtpCodeRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth/otp-code/generate',
    {
      schema: {
        summary: 'Gerar código OTP',
        description: 'Gera um código de uso único para verificação do usuário.',
        tags: ['Autenticação'],
        body: generateOtpCodeDto,
        response: {
          201: z.void(),
          400: httpErrorSchema,
          500: httpErrorSchema,
          502: httpErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const authDto = request.body

      const generateOtpCodeUseCase = new GenerateOtpCodeUseCase(
        new DrizzleUsersRepository(),
        new DrizzleOtpCodesRepository()
      )

      await generateOtpCodeUseCase.execute(authDto)

      return reply.status(201).send()
    }
  )
}
