import 'fastify'

interface GetCurrentUserResponse {
  sub: string
  role: 'master' | 'admin' | 'applicator'
}

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUser: () => Promise<GetCurrentUserResponse>
    isMasterCurrentUser: () => Promise<void>
  }
}
