import { ICreateCertificateUseCase } from "../../application/ports/ICreateCertificateUseCase"
import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from "express";
import QRCode from 'qrcode';
import fs from 'fs';
import httpStatus from "http-status";
import { PdfCertificate } from "../../domain/entities/PdfCertificate";
import CertificateValidator from "./validator/certificateValidator";
import { IDeleteCertificateUseCase } from "../../application/ports/IDeleteCertificateUseCase";
import { bodyToPdfCertificate } from "../gateways/mappers";


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
  
    try{
      const data = req.body;
      const certificate : PdfCertificate = await bodyToPdfCertificate(data);

      if (code !== certificate.code) {
        res.status(httpStatus.BAD_REQUEST).json(`The code ${code} does not match with ${certificate.code}`);
        return;
      }

      const errors = CertificateValidator.validate(certificate);
      if (errors.length) {
        res.status(httpStatus.BAD_REQUEST).json(errors);
        return;
      }
      
      const isDeleted = await this.deleteUseCase.run(code);
      if(!isDeleted) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(`Can't update certificate ${code}`);
        return;
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
        return;
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json();
        next();
      }
    } catch(error: any) {
      error.method = this.methodName;
      next(error);
    }
  }
}

