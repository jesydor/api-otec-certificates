import { DocumentInfo } from "../../domain/entities/DocumentInfo";

export interface IDocumentRepository {
  save(documentInfo: DocumentInfo): Promise<string>; 
}