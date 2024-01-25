import { ICreateCertificateUseCase } from "../../application/ports/ICreateCertificateUseCase"
import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from "express";
import QRCode from 'qrcode';
import fs from 'fs';
import httpStatus from "http-status";
import { PdfCertificate } from "../../domain/entities/PdfCertificate";
import CertificateValidator from "./validator/certificateValidator";
import { IDeleteCertificateUseCase } from "../../application/ports/IDeleteCertificateUseCase";

export default class UpdateController implements AbstractController {
  private readonly methodName = 'CreateController';
  private createUseCase;
  private deleteUseCase;

  constructor(deleteUseCase: IDeleteCertificateUseCase, createUseCase: ICreateCertificateUseCase) {
    this.createUseCase = createUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  run = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bucketName = process.env.BUCKET_CERTIFICATE;
    const code :string = req.params.code;
    const waterMarkPath = `${process.cwd()}/src/resources/images/solid-watermark.png`;
    const waterMarkBase64 = fs.readFileSync(waterMarkPath).toString('base64');

    const logoPath = `${process.cwd()}/src/resources/images/logo-header.png`;
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    const dorisCarrenoSignPath = `${process.cwd()}/src/resources/images/doris-carreno-sign.png`;
    const dorisCarrenoSignBase64 = fs.readFileSync(dorisCarrenoSignPath).toString('base64');


    try{
      const certificate: PdfCertificate = {
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
        candidateName: req.body.candidateName,
        candidateRut: req.body.candidateRut,
        status: req.body.status,
        approveDate: req.body.approveDate,
        qr: '',
        type: req.body.type,
        otecName: req.body.otecName || '',
      };

      if (code !== certificate.code) {
        res.status(httpStatus.BAD_REQUEST).json(`The code ${code} does not match with ${certificate.code}`);
      }

      const errors = CertificateValidator.validate(certificate);
      if (errors.length) {
        res.status(httpStatus.BAD_REQUEST).json(errors);
      }
      
      const isDeleted = await this.deleteUseCase.run(code);
      if(!isDeleted) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(`Can't update certificate ${code}`);
        next();
      }

      const fileName = `${certificate.companyLegalName}/${certificate.candidateName.replace(/ /g,"-")}/${certificate.code}-${certificate.courseCode}-${Date.now()}.pdf`;
      const qrCodeUrl = ` https://storage.googleapis.com/${bucketName}/${fileName}`;
      const gifBytes = await QRCode.toBuffer(qrCodeUrl, {
        errorCorrectionLevel: 'H'
      });

      certificate.qr = gifBytes.toString('base64');
      const response = await this.createUseCase.pdf(certificate, fileName);
      if (response.error === '') {
        res.status(httpStatus.CREATED).json(response.certificate);
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json();
      }
    } catch(error: any) {
      error.method = this.methodName;
      next(error);
    }
  }
}

