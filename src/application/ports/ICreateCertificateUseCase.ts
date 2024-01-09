export interface ICreateCertificateUseCase {
  pdf(data: Object): Promise<Buffer>; 
}