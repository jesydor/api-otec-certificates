import { UploadFile } from "../../domain/entities/UploadFile";
import IGoogleCloudRepository from "../../domain/ports/IGoogleCloudRepository";
import { Storage } from '@google-cloud/storage';

export default class GoogleCloudRepository implements IGoogleCloudRepository {
    async upload(certificate: Buffer, fileName: string): Promise<UploadFile> {
        const storage = new Storage({ keyFilename: '/Users/zae/.config/gcloud/application_default_credentials.json' });
        const bucketName = 'otec-certificates';
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
            response.error = 'Error al subir el archivo:' + error;
            console.error(response.error );
          }

          return response;
    }


    get(certificateId: string, withReport: boolean): Promise<any> {
        throw new Error("Method not implemented.");
    }

}