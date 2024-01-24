export interface GetResponse {
  certificate: Certificate
  error: string
}

export interface Certificate {
  code: string
  candidateRut: string
  companyRut: string
}