import { Certificate } from "../../domain/entities/Certificate";
import { Pagination } from "../../domain/entities/Pagination";

export interface IGetCertificateUseCase {
  byCode(code: string): Promise<Certificate>;
  byCompanyRut(rut: string): Promise<Certificate[]>;
  byCandidateRut(rut: string, pagination: Pagination): Promise<Certificate[]>;
}
