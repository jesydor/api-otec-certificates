import { DocumentInfo } from "../entities/DocumentInfo";
import { Pagination } from "../entities/Pagination";

export interface IDocumentRepository {
  getByCodes(codes: string[]): Promise<DocumentInfo[]>;
  getByCode(code: string): Promise<DocumentInfo>;
  getByCandidateRut(rut: string, pagination: Pagination): Promise<DocumentInfo[]>;
  getByCompanyRut(rut: string, pagination: Pagination): Promise<DocumentInfo[]>;
  save(documentInfo: DocumentInfo): Promise<DocumentInfo>;
  delete(code: string): Promise<Boolean>;
}