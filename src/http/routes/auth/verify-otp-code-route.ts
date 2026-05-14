import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleOtpCodesRepository } from '@/database/drizzle/repositories/drizzle-otp-codes-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { verifyOtpCodeDto } from '@/dtos/auth/verify-otp-code-dto'
import { AuthService } from '@/services/auth-service'

export const verifyOtpCodeRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth/otp-code/verify',
    {
      schema: {
        summary: 'Verify OTP Code',
        description: 'Verify a one-time password code for user authentication.',
        tags: ['Auth'],
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

      const authService = new AuthService(
        new DrizzleUsersRepository(),
        new DrizzleOtpCodesRepository()
      )

      await authService.verifyOtpCode(authDto)

      return reply.status(204).send()
    }
  )
}
