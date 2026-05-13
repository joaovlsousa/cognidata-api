import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleOtpCodesRepository } from '@/database/drizzle/repositories/drizzle-otp-codes-repository'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { generateOtpCodeDto } from '@/dtos/auth/generate-otp-code-dto'
import { AuthService } from '@/services/auth-service'

export const generateOtpCodeRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth/otp-code/generate',
    {
      schema: {
        summary: '',
        description: '',
        tags: ['Auth'],
        body: generateOtpCodeDto,
        response: {
          201: z.void(),
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

      await authService.generateOtpCode(authDto)

      return reply.status(201).send()
    }
  )
}
