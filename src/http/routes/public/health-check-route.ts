import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const healthCheckRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/public/health',
    {
      schema: {
        summary: 'Consultar status da API',
        description: 'Verifica se a API está pronta para receber requisições.',
        tags: ['Público'],
        response: {
          200: z.object({
            status: z.literal('ready'),
          }),
          503: z.object({
            status: z.literal('off'),
          }),
        },
      },
    },
    async (_request, reply) => {
      const isReady = app.server.listening

      if (!isReady) {
        return reply.status(503).send({
          status: 'off',
        })
      }

      return reply.status(200).send({
        status: 'ready',
      })
    }
  )
}
