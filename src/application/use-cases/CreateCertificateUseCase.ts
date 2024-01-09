import { ICreateCertificateUseCase } from '../ports/ICreateCertificateUseCase';
import PdfGenerationService from '../services/PdfGenerationService';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';

export default class CreateCertificateUseCase implements ICreateCertificateUseCase {
  private pdfGenerationService: PdfGenerationService;

  constructor(pdfGenerationService: PdfGenerationService) {
    this.pdfGenerationService = pdfGenerationService;
  }

  async pdf(data: Object): Promise<Buffer> {
    const htmlTemplate = await fs.readFile(__dirname + '/../../resources/templates/theoretical-practical/certificateDev.handlebars', 'utf-8');
    const template = handlebars.compile(htmlTemplate);
    const html = template(data);

    const browser = await puppeteer.launch({ headless: "new", args: ['--enable-local-file-accesses'] });
    const page = await browser.newPage();


    // Establece el contenido HTML de la página
    await page.setContent(html);

    // Genera el PDF
    const pdfBuffer = await page.pdf({ format: 'Legal' });

    // Cierra el navegador
    await browser.close();
    return pdfBuffer;

  }
}

