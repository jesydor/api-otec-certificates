import { CreateResponse } from "../../domain/entities/CreateResponse";

export interface IDeleteCertificateUseCase {
  run(code: string): Promise<Boolean>; 
}