export const createPatientsFromCsvValuesMapDto: Record<
  string,
  Record<string, string>
> = {
  gender: {
    masculino: 'male',
    feminino: 'female',
  },
  schoolSchedule: {
    manhã: 'morning',
    tarde: 'afternoon',
    integral: 'fullTime',
  },
  patientResponsibleKinship: {
    'pai/mãe': 'father/mother',
    'avô/avó': 'grandfather/grandmother',
    'tio/tia': 'uncle/aunt',
  },
}
