import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { httpErrorSchema } from '@/core/schemas/http-error-schema'
import { DrizzleContactsRepository } from '@/database/drizzle/repositories/drizzle-contacts-repository'
import { createContactDto } from '@/dtos/contacts/create-contact-dto'
import { CreateContactUseCase } from '@/use-cases/contacts/create-contact-use-case'

export const createContactRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/contacts',
    {
      schema: {
        summary: 'Criar contato',
        description: 'Cria uma nova mensagem de contato.',
        tags: ['Contatos'],
        body: createContactDto,
        response: {
          201: z.void(),
          400: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const contactDto = request.body

      const createContactUseCase = new CreateContactUseCase(
        new DrizzleContactsRepository()
      )
      await createContactUseCase.execute(contactDto)

      return reply.status(201).send()
    }
  )
}
