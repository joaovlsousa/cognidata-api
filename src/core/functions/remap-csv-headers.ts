export function remapCsvHeaders(
  row: Record<string, unknown>,
  csvHeaderMap: Record<string, string>
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(row)) {
    mapped[csvHeaderMap[key.toLowerCase()] ?? key.toLowerCase()] = value
  }

  return mapped
}
