import handlebars from 'handlebars';
import fs from 'fs';
import puppeteer from 'puppeteer';
import { loggerPino } from '../../resources/loggerPino';
import { PdfCertificate } from '../../domain/entities/PdfCertificate';

class PdfGenerationService {
  async generatePdf(htmlTemplate: string, data: PdfCertificate): Promise<Buffer> {
    loggerPino.info(`generating PDF ${data.code}`);
    handlebars.registerHelper('formatText', function(text) {
      if (!text) return text;
        return new handlebars.SafeString(text.replace(/\n/g, '<br>'));
    });

    const template = handlebars.compile(htmlTemplate);
    const html = template(data);

    const browser = await puppeteer.launch({ 
      executablePath: '/usr/bin/chromium', // Ruta del ejecutable de Chrome
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: "new",
    });
    const page = await browser.newPage();

    await page.setContent(html);
    const pdf = await page.pdf({ format: 'Legal' });
    await browser.close();

    return pdf;
  }
}

export default PdfGenerationService;
