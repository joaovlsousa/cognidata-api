import type { FastifyRequest } from 'fastify'
import { tokenSchema } from '@/core/auth/token-schema'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

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
