import { UploadFile } from "../../domain/entities/UploadFile";
import IFileStorageRepository from "../../domain/ports/IFileStorageRepository";
import { Storage } from '@google-cloud/storage';

export default class GoogleCloudRepository implements IFileStorageRepository {
    async upload(certificate: Buffer, fileName: string, bucketName: string): Promise<UploadFile> {
        const storage = new Storage({ keyFilename: '/Users/zae/.config/gcloud/application_default_credentials.json' });
        const response = {
            url: '',
            error: '',
        }

        try {
            // Obtén una referencia al bucket
            const bucket = storage.bucket(bucketName);
            const archivoStream = bucket.file(fileName).createWriteStream();
            archivoStream.end(certificate);
    
            await new Promise((resolve, reject) => {
                archivoStream.on('finish', resolve);
                archivoStream.on('error', reject);
            });
          
            response.url = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          } catch (error) {
            response.error = 'Error uploading file:' + error;
            console.error(response.error);
          }

          return response;
    }
}