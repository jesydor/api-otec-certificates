import fs from 'fs';

class PdfGenerationService {
  async generatePdf(htmlContent: string) {
    
  }

  readImage(imgPath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(imgPath, (err, data) => {
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

export default PdfGenerationService;
