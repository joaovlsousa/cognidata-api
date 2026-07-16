import { env } from './env'

export const origin: string[] = [env.CLIENT_APP_URL]

if (env.NODE_ENV !== 'prod') {
  origin.push('http://localhost:5173')
}
