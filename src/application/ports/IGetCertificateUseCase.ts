import { GetResponse } from "../../domain/entities/GetResponse";

export interface IGetCertificateUseCase {
  byCode(code: string): Promise<GetResponse>;
  byCompanyRut(rut: string): Promise<GetResponse>;
  byCandidateRut(rut: string): Promise<GetResponse>;
}
