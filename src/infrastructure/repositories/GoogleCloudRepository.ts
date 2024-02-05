import { UploadFile } from "../../domain/entities/UploadFile";
import IFileStorageRepository from "../../domain/ports/IFileStorageRepository";
import { Storage } from '@google-cloud/storage';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';


export default class GoogleCloudRepository implements IFileStorageRepository {
    async  upload(certificate: Buffer, fileName: string, bucketName: string): Promise<UploadFile> {
        const projectId = process.env.PROJECT_ID || '';
        const response = {
            url: '',
            error: '',
        };
    
        try {
            const storageOptions = process.env.GOOGLE_APPLICATION_CREDENTIALS
            ? { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS }
            : {}
            
            const storage = new Storage(storageOptions);
            const bucket = storage.bucket(bucketName);
            const archivoStream = bucket.file(fileName).createWriteStream();
            archivoStream.end(certificate);
    
            await new Promise((resolve, reject) => {
                archivoStream.on('finish', resolve);
                archivoStream.on('error', reject);
            });
    
            response.url = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        } catch (error) {
            response.error = `Error uploading file: ${error} - ${fileName}`;
            console.error(response.error);
        }
    
        return response;
    }
}