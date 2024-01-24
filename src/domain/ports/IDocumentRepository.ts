import { DocumentInfo } from "../entities/DocumentInfo";
import { Pagination } from "../entities/Pagination";

export interface IDocumentRepository {
  getByCode(code: string): Promise<DocumentInfo>;
  getByCandidateRut(rut: string, pagination: Pagination): Promise<DocumentInfo[]>;
  save(documentInfo: DocumentInfo): Promise<DocumentInfo>; 
}