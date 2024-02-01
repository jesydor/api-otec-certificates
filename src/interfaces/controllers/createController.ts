import { ICreateCertificateUseCase } from "../../application/ports/ICreateCertificateUseCase"
import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from "express";
import QRCode from 'qrcode';
import httpStatus from "http-status";
import { IUploadCertificateUseCase } from "../../application/ports/IUploadCertificateUseCase";
import CertificateValidator from "./validator/certificateValidator";
import { loggerPino } from "../../../resources/loggerPino";
import { PdfCertificate } from "../../domain/entities/PdfCertificate";
import { bodyToPdfCertificate } from "../gateways/mappers";

export default class CreateController implements AbstractController {
  private readonly methodName = 'CreateController';
  private createUseCase;

  constructor(createUseCase: ICreateCertificateUseCase, uploadCertificateUseCase: IUploadCertificateUseCase) {
    this.createUseCase = createUseCase;
  }

  run = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bucketName = process.env.BUCKET_CERTIFICATE;
    try{
      const data = req.body;
      const certificate : PdfCertificate = await bodyToPdfCertificate(data);
      const errors = CertificateValidator.validate(certificate);
      if (errors.length) {
        loggerPino.info(`bad request ${req.body}}`);
        res.status(httpStatus.BAD_REQUEST).json(errors);
        next();
      }

      const fileName = `${certificate.companyLegalName}/${certificate.candidateName.replace(/ /g,"-")}/${certificate.code}-${certificate.courseCode}-${Date.now()}.pdf`;
      const qrCodeUrl = ` https://storage.googleapis.com/${bucketName}/${fileName}`;
      const gifBytes = await QRCode.toBuffer(qrCodeUrl, {
        errorCorrectionLevel: 'H'
      });

      certificate.qr = gifBytes.toString('base64');
      const response = await this.createUseCase.pdf(certificate, fileName);
      if (!response.error.length) {
        res.status(httpStatus.CREATED).json(response.certificate);
        return;
      }

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json();
      next();
    } catch(error: any) {
      error.method = this.methodName;
      loggerPino.error(`error ${error.method}}`);
      next(error);
    }
  }
}

