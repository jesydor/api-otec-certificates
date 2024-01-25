import { CreateResponse } from "../../domain/entities/CreateResponse";
import { PdfCertificate } from "../../domain/entities/PdfCertificate";

export interface ICreateCertificateUseCase {
  pdf(data: PdfCertificate, fileName: string): Promise<CreateResponse>; 
}