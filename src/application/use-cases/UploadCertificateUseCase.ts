import { IUploadCertificateUseCase } from '../ports/IUploadCertificateUseCase';
import IFileStorageRepository from '../../domain/ports/IFileStorageRepository';
import { UploadFile } from '../../domain/entities/UploadFile';

export default class UploadCertificateUseCase implements IUploadCertificateUseCase {
  private fileStorageRepository: IFileStorageRepository;

  constructor(fileStorageRepository: IFileStorageRepository) {
    this.fileStorageRepository = fileStorageRepository;
  }

  upload(certificate: Buffer, fileName: string): Promise<UploadFile> {
    const bucketName = process.env.BUCKET_CERTIFICATE || 'otec-certificates';
    return this.fileStorageRepository.upload(certificate, fileName, bucketName);
  }
}

