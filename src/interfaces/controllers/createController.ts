import { ICreateCertificateUseCase } from "../../application/ports/ICreateCertificateUseCase"
import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from "express";
import QRCode from 'qrcode';
import fs from 'fs';
import httpStatus from "http-status";
import { IUploadCertificateUseCase } from "../../application/ports/IUploadCertificateUseCase";
import { Certificate } from "./request/Certificate";

export default class CreateController implements AbstractController {
  private readonly methodName = 'CreateController';
  private createUseCase;

  constructor(createUseCase: ICreateCertificateUseCase, uploadCertificateUseCase: IUploadCertificateUseCase) {
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

    const data: Certificate = {
      code: '103871-2',
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
      practicalEndDate: '30-11-2023',
      theoreticalFacilitator: 'TATIANA JORQUERA OLIVARES',
      practicalFacilitator: 'JULIO BERNARDO GONZÁLEZ COLLAO',
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
      const fileName = `${data.companyLegalName}/${data.candidateName.replace(/ /g,"-")}/${data.code}-${data.courseCode}-${Date.now()}.pdf`;
      const response = await this.createUseCase.pdf(data, fileName);

      if (response.error === '') {
        res.status(httpStatus.CREATED).json(response.certificate);
      }

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json();
    } catch(error: any) {
      error.method = this.methodName;
      next(error);
    }
  }
}

