import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { tokenSchema } from '@/core/auth/token-schema'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { authRequestDto } from '@/dtos/auth/auth-request-dto'
import { authResponseDto } from '@/dtos/auth/auth-response-dto'
import { AuthService } from '@/services/auth-service'

export const authenticateWithEmailAndPasswordRoute: FastifyPluginAsyncZod =
  async (app) => {
    app.post(
      '/auth',
      {
        schema: {
          summary: 'Authenticate with e-mail and password',
          tags: ['Auth'],
          body: authRequestDto,
          response: {
            201: authResponseDto,
            400: httpErrorSchema,
            500: httpErrorSchema,
          },
        },
      },
      async (request, reply) => {
        const authDto = request.body

        const authService = new AuthService(new DrizzleUsersRepository())

        const { id, role } =
          await authService.authenticateWithEmailAndPassword(authDto)

        const payload = tokenSchema.parse({ sub: id, role })
        const token = await reply.jwtSign(payload, {
          sign: {
            sub: id,
            expiresIn: '7d',
          },
        })

        return reply.status(201).send({
          token,
        })
      }
    )
  }
