import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/http/server.ts'],
  format: ['esm'],
  target: 'node24',
  clean: true,
})
