import Papa from 'papaparse'
import type { z } from 'zod'
import { BadRequestError } from '../errors/bad-request-error'
import { remapCsvHeaders } from './remap-csv-headers'
import { remapCsvValues } from './remap-csv-values'

interface ParseAndValidateCsvOptions {
  maxRows?: number
  csvHeadersMap?: Record<string, string>
  csvValuesMap?: Record<string, Record<string, string>>
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
  const { maxRows = 50, csvHeadersMap, csvValuesMap } = options

  const { data } = Papa.parse<Record<string, unknown>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  if (data.length > maxRows) {
    throw new BadRequestError(
      `O arquivo possui ${data.length} linhas, o máximo permitido é ${maxRows}`
    )
  }

  const validRows: T[] = []
  const invalidRows = new Set<number>()

  let rowsToValidate = csvHeadersMap
    ? data.map((row) => remapCsvHeaders(row, csvHeadersMap))
    : data

  if (csvValuesMap) {
    rowsToValidate = rowsToValidate.map((row) =>
      remapCsvValues(row, csvValuesMap)
    )
  }

  rowsToValidate.forEach((row, index) => {
    const result = schema.safeParse(row)

    result.success ? validRows.push(result.data) : invalidRows.add(index + 2)
  })

  return {
    data: validRows,
    invalidRows: invalidRows.values().toArray(),
  }
}
