import handlebars from 'handlebars';
import fs from 'fs';
import puppeteer from 'puppeteer';

class PdfGenerationService {
  async generatePdf(htmlTemplate: string, data: Object): Promise<Buffer> {
    const template = handlebars.compile(htmlTemplate);
    const html = template(data);

    const browser = await puppeteer.launch({ headless: "new", args: ['--enable-local-file-accesses', '--no-sandbox'] });
    const page = await browser.newPage();

    await page.setContent(html);
    const pdf = await page.pdf({ format: 'Legal' });
    await browser.close();

    return pdf;
  }
}

export default PdfGenerationService;
