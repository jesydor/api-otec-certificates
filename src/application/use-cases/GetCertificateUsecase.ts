import { Certificate } from "../../domain/entities/Certificate";
import { GetResponse } from "../../domain/entities/GetResponse";
import { IDocumentRepository } from "../../domain/ports/IDocumentRepository";
import { IGetCertificateUseCase } from "../ports/IGetCertificateUseCase";

export default class GetCertificateUseCase implements IGetCertificateUseCase {
    private documentsRepository: IDocumentRepository;
  
    constructor(documentsRepository: IDocumentRepository)  {
      this.documentsRepository = documentsRepository;
    }

    async byCode(code: string): Promise<GetResponse> {
        const response :GetResponse = {
            error: '',
            certificate: {
                code: '',
                candidateRut: '',
                companyRut: 
            },
        };
        const getted = await this.documentsRepository.getByCode(code);
        if (getted.error) {
            response.error = getted.error;
            return response;
        }


        return {
            certificate,
            error: ''
          };
    }

    byCompanyRut(rut: string): Promise<GetResponse> {
        throw new Error("Method not implemented.");
    }

    byCandidateRut(rut: string): Promise<GetResponse> {
        throw new Error("Method not implemented.");
    }
}