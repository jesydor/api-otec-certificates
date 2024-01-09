export interface IUploadCertificateUseCase {
  upload(certificate: Buffer, fileName: string): Promise<UploadFile>; 
}