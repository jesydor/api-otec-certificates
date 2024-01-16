import { CreateResponse } from "../../domain/entities/CreateResponse";

export interface ICreateCertificateUseCase {
  pdf(data: Object, fileName: string): Promise<CreateResponse>; 
}