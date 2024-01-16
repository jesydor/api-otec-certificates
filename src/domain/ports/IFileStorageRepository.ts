import { UploadFile } from "../entities/UploadFile";

interface IFileStorageRepository {
  upload(certificate: Buffer, fileName: string, bucketName: string): Promise<UploadFile>;
}

export default IFileStorageRepository;
