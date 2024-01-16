import { UploadFile } from "../../domain/entities/UploadFile";

export interface IUploadCertificateUseCase {
  upload(certificate: Buffer, fileName: string): Promise<UploadFile>; 
}