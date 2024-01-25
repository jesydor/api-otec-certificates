import { CreateResponse } from "../../domain/entities/CreateResponse";
import { IDocumentRepository } from "../../domain/ports/IDocumentRepository";
import { ICreateCertificateUseCase } from "../ports/ICreateCertificateUseCase";
import { IDeleteCertificateUseCase } from "../ports/IDeleteCertificateUseCase";

export default class DeleteCertificateUseCase implements IDeleteCertificateUseCase {
  private documentsRepository: IDocumentRepository;

  constructor(documentsRepository: IDocumentRepository)  {
    this.documentsRepository = documentsRepository;
  }

  run(code: string): Promise<Boolean> {
    return this.documentsRepository.delete(code);
  }
}