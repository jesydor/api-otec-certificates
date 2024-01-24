import { Certificate } from "../../domain/entities/Certificate";

export interface IGetCertificateUseCase {
  byCode(code: string): Promise<Certificate>;
  byCompanyRut(rut: string): Promise<Certificate[]>;
  byCandidateRut(rut: string): Promise<Certificate[]>;
}
