import type { FastifyRequest } from 'fastify'
import { ForbiddenError } from '@/core/errors/forbidden-error'

export async function authorizationMiddleware(request: FastifyRequest) {
  request.isMasterCurrentUser = async () => {
    const { role } = await request.getCurrentUser()

    if (role !== 'master') {
      throw new ForbiddenError(
        'Você não tem permissão para realizar essa ação.'
      )
    }
  }

  request.isAdminCurrentUser = async () => {
    const { role } = await request.getCurrentUser()

    if (role !== 'admin') {
      throw new ForbiddenError(
        'Você não tem permissão para realizar essa ação.'
      )
    }
  }

  request.isApplicatorCurrentUser = async () => {
    const { role } = await request.getCurrentUser()

    if (role !== 'applicator') {
      throw new ForbiddenError(
        'Você não tem permissão para realizar essa ação.'
      )
    }
  }
}
