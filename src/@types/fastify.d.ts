import 'fastify'

interface GetCurrentUserResponse {
  sub: string
  role: string
}

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUser: () => Promise<GetCurrentUserResponse>
  }
}
