export function remapCsvValues(
  row: Record<string, unknown>,
  valueMaps: Record<string, Record<string, string>>
): Record<string, unknown> {
  const mapped: Record<string, unknown> = { ...row }

  for (const [field, map] of Object.entries(valueMaps)) {
    const rawValue = mapped[field]
    if (typeof rawValue !== 'string') continue

    const normalizedKey = rawValue.trim().toLowerCase()
    const matchedKey = Object.keys(map).find(
      (k) => k.toLowerCase() === normalizedKey
    )

    if (matchedKey) {
      mapped[field] = map[matchedKey]
    }
  }

  return mapped
}
