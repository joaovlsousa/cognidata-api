export const createPatientsFromCsvHeadersMapDto: Record<string, string> = {
  nome: 'name',
  'data de nascimento': 'dateOfBirth',
  gênero: 'gender',
  'nome do responsável': 'patientResponsibleName',
  'email do responsável': 'patientResponsibleEmail',
  'parentesco do responsável': 'patientResponsibleKinship',
  'telefone do responsável': 'patientResponsiblePhone',
  'nome da escola': 'schoolName',
  'ano escolar': 'schoolYear',
  'turno escolar': 'schoolSchedule',
  'queixa principal': 'medicalChiefComplaint',
  observações: 'medicalObservations',
}
