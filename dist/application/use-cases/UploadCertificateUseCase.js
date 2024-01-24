"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UploadCertificateUseCase {
    constructor(fileStorageRepository) {
        this.fileStorageRepository = fileStorageRepository;
    }
    upload(certificate, fileName) {
        // TODO change by env var
        const bucketName = 'otec-certificates';
        return this.fileStorageRepository.upload(certificate, fileName, bucketName);
    }
}
exports.default = UploadCertificateUseCase;
