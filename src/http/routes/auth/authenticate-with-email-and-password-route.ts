import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { tokenSchema } from '@/core/schemas/token-schema'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories/drizzle-users-repository'
import { authRequestDto } from '@/dtos/auth/auth-request-dto'
import { authResponseDto } from '@/dtos/auth/auth-response-dto'
import { AuthenticateWithEmailAndPasswordUseCase } from '@/use-cases/auth/authenticate-with-email-and-password-use-case'

export const authenticateWithEmailAndPasswordRoute: FastifyPluginAsyncZod =
  async (app) => {
    app.post(
      '/auth',
      {
        schema: {
          summary: 'Authenticate with email and password',
          description:
            'Authenticate the user using email and password to generate a JWT token.',
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

        const authenticateWithEmailAndPasswordUseCase =
          new AuthenticateWithEmailAndPasswordUseCase(
            new DrizzleUsersRepository()
          )

        const { user } =
          await authenticateWithEmailAndPasswordUseCase.execute(authDto)

        const tokenMaxAge = 60 * 60 * 24 * 7 //7 days
        const payload = tokenSchema.parse({ sub: user.id, role: user.role })
        const token = await reply.jwtSign(payload, {
          sign: {
            sub: user.id,
            expiresIn: tokenMaxAge,
          },
        })

        return reply.status(201).send({
          token,
        })
      }
    )
  }
