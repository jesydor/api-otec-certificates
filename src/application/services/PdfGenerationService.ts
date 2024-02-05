import handlebars from 'handlebars';
import fs from 'fs';
import puppeteer from 'puppeteer';
import { loggerPino } from '../../resources/loggerPino';
import { PdfCertificate } from '../../domain/entities/PdfCertificate';

class PdfGenerationService {
  async generatePdf(htmlTemplate: string, data: PdfCertificate): Promise<Buffer> {
    loggerPino.info(`generating PDF ${data.code}`);
    const template = handlebars.compile(htmlTemplate);
    const html = template(data);

    const browser = await puppeteer.launch({ 
      executablePath: '/usr/bin/chromium-browser', // Ruta del ejecutable de Chrome
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true,
    });
    const page = await browser.newPage();

    await page.setContent(html);
    const pdf = await page.pdf({ format: 'Legal' });
    await browser.close();

    return pdf;
  }
}

export default PdfGenerationService;
