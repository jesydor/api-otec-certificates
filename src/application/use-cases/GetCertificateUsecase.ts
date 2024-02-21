import { IDocumentRepository } from "../../domain/ports/IDocumentRepository";
import { IGetCertificateUseCase } from "../ports/IGetCertificateUseCase";
import { DocumentInfo } from "../../domain/entities/DocumentInfo";
import { Certificate } from "../../domain/entities/Certificate";
import { Pagination } from "../../domain/entities/Pagination";


export default class GetCertificateUseCase implements IGetCertificateUseCase {
    private documentsRepository: IDocumentRepository;
  
    constructor(documentsRepository: IDocumentRepository)  {
      this.documentsRepository = documentsRepository;
    }

    byCompanyRut(rut: string, pagination: Pagination): Promise<Certificate[]> {
        return this.documentsRepository.getByCompanyRut(rut, pagination);
    }
    
    byCandidateRut(rut: string, pagination: Pagination): Promise<Certificate[]> {
        return this.documentsRepository.getByCandidateRut(rut, pagination);
    }

    async byCode(code: string): Promise<DocumentInfo> {
        return this.documentsRepository.getByCode(code);
    }

    async byCodes(codes: string[]): Promise<DocumentInfo[]> {
        return this.documentsRepository.getByCodes(codes);
    }

}
