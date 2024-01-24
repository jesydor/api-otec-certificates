import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from "express";
import QRCode from 'qrcode';
import fs from 'fs';
import httpStatus from "http-status";
import { IUploadCertificateUseCase } from "../../application/ports/IUploadCertificateUseCase";

import { IGetCertificateUseCase } from "../../application/ports/IGetCertificateUseCase";
import { Certificate } from "../../domain/entities/Certificate";

export default class GetController implements AbstractController {
  private readonly methodName = 'GetController';
  private getUseCase;

  constructor(getUseCase: IGetCertificateUseCase) {
    this.getUseCase = getUseCase;
  }

  run = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
    const code :string = req.params.code;
      const response = await this.getUseCase.byCode(code);
      const certificate :Certificate = {
        code: response.code,
        candidateRut: response.candidateRut,
        companyRut: response.companyRut,
        url: response.url,
      }

      if (certificate.code != '') {
        res.status(httpStatus.OK).json(certificate);
      } else {
        res.status(httpStatus.OK).json({});
      }

    } catch(error: any) {
      error.method = this.methodName;
      next(error);
    }
  }
}

