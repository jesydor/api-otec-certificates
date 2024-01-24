import { Certificate } from "./Certificate"

export interface CreateResponse {
  certificate: Certificate
  error: string
}