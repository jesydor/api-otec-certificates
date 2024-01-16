import { IDocumentRepository } from "../../application/ports/IDocumentRepository";
import { DocumentInfo } from "../../domain/entities/DocumentInfo";

export default class PgRepository implements IDocumentRepository {
    save(documentInfo: DocumentInfo): Promise<string> {
        throw new Error("Method not implemented.");
    }
}