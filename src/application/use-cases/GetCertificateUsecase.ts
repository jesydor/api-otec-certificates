import { IDocumentRepository } from "../../domain/ports/IDocumentRepository";
import { IGetCertificateUseCase } from "../ports/IGetCertificateUseCase";
import { DocumentInfo } from "../../domain/entities/DocumentInfo";
import { Certificate } from "../../domain/entities/Certificate";


export default class GetCertificateUseCase implements IGetCertificateUseCase {
    private documentsRepository: IDocumentRepository;
  
    constructor(documentsRepository: IDocumentRepository)  {
      this.documentsRepository = documentsRepository;
    }
    byCompanyRut(rut: string): Promise<Certificate[]> {
        throw new Error("Method not implemented.");
    }
    byCandidateRut(rut: string): Promise<Certificate[]> {
        throw new Error("Method not implemented.");
    }

    async byCode(code: string): Promise<DocumentInfo> {
        return this.documentsRepository.getByCode(code);
    }

}
