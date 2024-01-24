import { ICreateCertificateUseCase } from "../../application/ports/ICreateCertificateUseCase"
import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from "express";
import QRCode from 'qrcode';
import fs from 'fs';
import httpStatus from "http-status";
import { IUploadCertificateUseCase } from "../../application/ports/IUploadCertificateUseCase";
import { Certificate } from "./request/Certificate";
import CertificateValidator from "./validator/certificateValidator";

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

    try{
      const certificate: Certificate = {
        code: req.body.code,
        'sign': dorisCarrenoSignBase64,
        'logo-header': logoBase64,
        'watermark': waterMarkBase64,
        companyRut: req.body.companyRut,
        companyLegalName: req.body.companyLegalName,
        courseName: req.body.courseName,
        courseCode: req.body.courseCode,
        courseNumberHours: req.body.courseNumberHours,
        validityCourse: req.body.validityCourse,
        theoreticalStartDate: req.body.theoreticalStartDate,
        theoreticalEndDate: req.body.theoreticalEndDate,
        practicalStartDate: req.body.practicalStartDate,
        practicalEndDate: req.body.practicalEndDate,
        theoreticalFacilitator: req.body.theoreticalFacilitator,
        practicalFacilitator: req.body.practicalFacilitator,
        day: req.body.day,
        month: req.body.month,
        year: req.body.year,
        candidateName: req.body.candidateName,
        candidateRut: req.body.candidateRut,
        status: req.body.status,
        approveDate: req.body.approveDate,
        qr: gifBytes.toString('base64')
      };

      const errors = CertificateValidator.validate(certificate);
      if (errors.length) {
        res.status(httpStatus.BAD_REQUEST).json(errors);
      }

      const fileName = `${certificate.companyLegalName}/${certificate.candidateName.replace(/ /g,"-")}/${certificate.code}-${certificate.courseCode}-${Date.now()}.pdf`;
      const response = await this.createUseCase.pdf(certificate, fileName);
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

