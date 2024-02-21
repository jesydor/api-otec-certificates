import { Certificate } from "../../domain/entities/Certificate";
import { Pagination } from "../../domain/entities/Pagination";

export interface IGetCertificateUseCase {
  byCodes(codes: string[]): Promise<Certificate[]>;
  byCode(code: string): Promise<Certificate>;
  byCompanyRut(rut: string, pagination: Pagination): Promise<Certificate[]>;
  byCandidateRut(rut: string, pagination: Pagination): Promise<Certificate[]>;
}
