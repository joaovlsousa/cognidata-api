import Papa from 'papaparse'
import type { z } from 'zod'
import { BadRequestError } from '../errors/bad-request-error'

interface ParseAndValidateCsvOptions {
  maxRows?: number
}

interface ParseAndValidateCsvResponse<T> {
  data: T[]
  invalidRows: number[]
}

export function parseAndValidateCsv<T>(
  csvContent: string,
  schema: z.ZodType<T>,
  options: ParseAndValidateCsvOptions = {}
): ParseAndValidateCsvResponse<T> {
  const { maxRows = 1000 } = options

  const { data } = Papa.parse<Record<string, unknown>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  if (data.length > maxRows) {
    throw new BadRequestError(
      `O arquivo possui ${data.length} linhas, o máximo permitido é ${maxRows}`
    )
  }

  const valid: T[] = []
  const invalidRows = new Set<number>()

  data.forEach((row, index) => {
    const result = schema.safeParse(row)

    result.success ? valid.push(result.data) : invalidRows.add(index + 2)
  })

  return {
    data: valid,
    invalidRows: invalidRows.values().toArray(),
  }
}
