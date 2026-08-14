import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleOtpCodesRepository } from '@/database/drizzle/repositories/drizzle-otp-codes-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { resetPasswordDto } from '@/dtos/auth/reset-password-dto'
import { ResetPasswordUseCase } from '@/use-cases/auth/reset-password-use-case'

export const resetPasswordRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth/reset-password',
    {
      schema: {
        summary: 'Reset Password',
        description: 'Reset the user password using a valid OTP code.',
        tags: ['Auth'],
        body: resetPasswordDto,
        response: {
          204: z.void(),
          400: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const authDto = request.body

      const resetPasswordUseCase = new ResetPasswordUseCase(
        new DrizzleUsersRepository(),
        new DrizzleOtpCodesRepository()
      )

      await resetPasswordUseCase.execute(authDto)

      return reply.status(204).send()
    }
  )
}
