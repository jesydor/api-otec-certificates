import { IUploadCertificateUseCase } from '../ports/IUploadCertificateUseCase';
import ICertificateRepository from '../../domain/ports/IGoogleCloudRepository';
import { UploadFile } from '../../domain/entities/UploadFile';

export default class UploadCertificateUseCase implements IUploadCertificateUseCase {
  private certificateRepository: ICertificateRepository;

  constructor(certificateRepository: ICertificateRepository) {
    this.certificateRepository = certificateRepository;
  }

  upload(certificate: Buffer, fileName: string): Promise<UploadFile> {
    return this.certificateRepository.upload(certificate, fileName);
  }
}

