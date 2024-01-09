import fs from 'fs';

class GoogleCloudStorageService {
  uploadCertificate(file: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const base64String = Buffer.from(data).toString('base64');
        resolve(base64String);
      });
    });
  }
}

export default GoogleCloudStorageService;
