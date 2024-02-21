import { ICreateCertificateUseCase } from "../../application/ports/ICreateCertificateUseCase"
import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from "express";
import QRCode from 'qrcode';
import httpStatus from "http-status";
import CertificateValidator from "./validator/certificateValidator";
import { loggerPino } from "../../resources/loggerPino";
import { PdfCertificate } from "../../domain/entities/PdfCertificate";
import { bodyToPdfCertificateMap } from "../gateways/mappers";
import { CreateResponse } from "../responses/create";
import { IGetCertificateUseCase } from "../../application/ports/IGetCertificateUseCase";
import { Certificate } from "../../domain/entities/Certificate";

export default class CreateController implements AbstractController {
  private readonly methodName = 'CreateController';
  private createUseCase;
  private getUseCase;

  constructor(createUseCase: ICreateCertificateUseCase, getCertificateUseCase: IGetCertificateUseCase) {
    this.createUseCase = createUseCase;
    this.getUseCase = getCertificateUseCase;
  }

  run = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bucketName = process.env.BUCKET_CERTIFICATE;
    try {
      const data = req.body;
      const certificates: Map<string, PdfCertificate> = await bodyToPdfCertificateMap(data);
      const codes = Array.from(certificates.keys());
      const r :CreateResponse = {
        success: [],
        errors: [],
      };

      const rdy :Certificate[] = await this.getUseCase.byCodes(codes);
      rdy.forEach( certificate => {
        r.success.push(certificate);
        certificates.delete(certificate.code);
      });
      
      const certificatesArray = Array.from(certificates.values());
      for (let i = 0; i < certificatesArray.length; i++) {
          const certificate = certificatesArray[i];
      
          const errors = await CertificateValidator.validate(certificate);
          if (errors.length) {
              r.errors.push({ errors, code: certificate.code });
              continue;
          }
      
          const fileName = `${certificate.companyLegalName}/${certificate.candidateName.replace(/ /g, "-")}/${certificate.code}-${certificate.courseCode}-${Date.now()}.pdf`;
          const qrCodeUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          const gifBytes = await QRCode.toBuffer(qrCodeUrl, {
              errorCorrectionLevel: 'H'
          });
      
          certificate.qr = gifBytes.toString('base64');
          const response = await this.createUseCase.pdf(certificate, fileName);
          if (response.error.length) {
              r.errors.push({ errors, code: certificate.code });
              continue;
          }
      
          r.success.push(response.certificate);
      }
      

      if (r.errors.length && !r.success.length) {
        res.status(httpStatus.BAD_REQUEST).json(r);
      } else {
        res.status(httpStatus.CREATED).json(r);
      }
    } catch (error: any) {
      error.method = this.methodName;
      loggerPino.error(`Error in run method: ${error.message}`);
      next(error);
    }
  }
}

