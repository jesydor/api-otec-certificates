import { ICreateCertificateUseCase } from "../../application/ports/ICreateCertificateUseCase"
import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from "express";
import QRCode from 'qrcode';
import fs from 'fs';

export default class CreateController implements AbstractController {
  private readonly methodName = 'CreateController';
  private createUseCase;

  constructor(createUseCase: ICreateCertificateUseCase) {
    this.createUseCase = createUseCase;
  }

  run = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const waterMarkPath = `${process.cwd()}/src/resources/images/solid-watermark.png`;
    const waterMarkBase64 = fs.readFileSync(waterMarkPath).toString('base64');

    const logoPath = `${process.cwd()}/src/resources/images/logo-header.png`;
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    const dorisCarrenoSignPath = `${process.cwd()}/src/resources/images/doris-carreno-sign.png`;
    const dorisCarrenoSignBase64 = fs.readFileSync(dorisCarrenoSignPath).toString('base64');

    const qrCodeUrl = 'https://portalotecjesydor.cl/Administrador/Certificados/pdf/certificados2.0.php?idcertificado=103872';
    const gifBytes = await QRCode.toBuffer(qrCodeUrl, {
      errorCorrectionLevel: 'H'
    });


    const data = {
      code: '103871',
      'sign': dorisCarrenoSignBase64,
      'logo-header': logoBase64,
      'watermark': waterMarkBase64,
      companyRut: '59.069.860-1',
      companyLegalName: 'ACCIONA CONSTRUCCION S.A',
      courseName: 'TRABAJO EN ALTURA FÍSICA TEÓRICO - PRACTICO',
      courseCode: 'CTP8-TA',
      courseNumberHours: 8,
      validityCourse: 4, 
      theoreticalStartDate: '09-11-2023',
      theoreticalEndDate: '09-11-2023',
      practicalStartDate: '30-11-2023',
      practicalEndtDate: '30-11-2023',
      theoreticalFacilitator: 'TATIANA JORQUERA OLIVARES',
      practicalFacilitator: 'JULIO BERNARDO GONZáLEZ COLLAO',
      day: 9,
      month: 'Febrero',
      year: 2024,
      candidateName: 'LEONARDO ANDRES LEIVA DIAZ ',
      candidateRut: '13.505.775-4 ',
      status: 'Aprobado Nota:100',
      approveDate: '25 de Agosto 2023',
      qr: gifBytes.toString('base64')
    };

    try{
      const pdfBytes = await this.createUseCase.pdf(data);
      const buffer = Buffer.from(pdfBytes);
        
      // Configura los encabezados para la descarga del archivo
      res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'attachment; filename=nombre-del-archivo.pdf'); //TO DOWNLOAD
      res.setHeader('Content-Disposition', 'inline; filename=nombre-del-archivo.pdf');

      res.status(200);
      res.send(buffer);
      
    } catch(error: any) {
      error.method = this.methodName;
      next(error);
    }
  }
}

