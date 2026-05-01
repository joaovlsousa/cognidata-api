import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { ZodError } from 'zod'
import { HttpError } from '@/core/errors/http-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error) || error instanceof ZodError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof HttpError) {
    return reply.status(error.getCode()).send({
      message: error.getMessage(),
    })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Erro interno do servidor' })
}
