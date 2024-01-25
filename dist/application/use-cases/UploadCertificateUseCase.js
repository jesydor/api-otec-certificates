"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UploadCertificateUseCase {
    constructor(fileStorageRepository) {
        this.fileStorageRepository = fileStorageRepository;
    }
    upload(certificate, fileName) {
        const bucketName = process.env.BUCKET_CERTIFICATE || 'otec-certificates';
        return this.fileStorageRepository.upload(certificate, fileName, bucketName);
    }
}
exports.default = UploadCertificateUseCase;
