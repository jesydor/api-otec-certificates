import { UploadFile } from "../entities/UploadFile";

interface IGoogleCloudRepository {
  upload(certificate: Buffer, fileName: string): Promise<UploadFile>;
  get(certificateId: string, withReport: boolean): Promise<any>;
}

export default IGoogleCloudRepository;
