import { DocumentInfo } from "../entities/DocumentInfo";

export interface IDocumentRepository {
  getByCode(code: string): Promise<DocumentInfo>;
  save(documentInfo: DocumentInfo): Promise<DocumentInfo>; 
}