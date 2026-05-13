import type { FastifyRequest } from 'fastify'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { tokenSchema } from '@/core/schemas/token-schema'

export async function authMiddleware(request: FastifyRequest) {
  request.getCurrentUser = async () => {
    try {
      await request.jwtVerify()

      const { sub, role } = tokenSchema.parse(request.user)

      return {
        sub,
        role,
      }
    } catch {
      throw new UnauthorizedError()
    }
  }
}
