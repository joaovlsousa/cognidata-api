import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleOtpCodesRepository } from '@/database/drizzle/repositories/drizzle-otp-codes-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { resetPasswordDto } from '@/dtos/auth/reset-password-dto'
import { AuthService } from '@/services/auth-service'

export const resetPasswordRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth/reset-password',
    {
      schema: {
        summary: '',
        description: '',
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

      const authService = new AuthService(
        new DrizzleUsersRepository(),
        new DrizzleOtpCodesRepository()
      )

      await authService.resetPassword(authDto)

      return reply.status(204).send()
    }
  )
}
