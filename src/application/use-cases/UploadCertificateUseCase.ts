import { IUploadCertificateUseCase } from '../ports/IUploadCertificateUseCase';
import IFileStorageRepository from '../../domain/ports/IFileStorageRepository';
import { UploadFile } from '../../domain/entities/UploadFile';

export default class UploadCertificateUseCase implements IUploadCertificateUseCase {
  private fileStorageRepository: IFileStorageRepository;

  constructor(fileStorageRepository: IFileStorageRepository) {
    this.fileStorageRepository = fileStorageRepository;
  }

  upload(certificate: Buffer, fileName: string): Promise<UploadFile> {
    // TODO change by env var
    const bucketName = 'otec-certificates';
    return this.fileStorageRepository.upload(certificate, fileName, bucketName);
  }
}

