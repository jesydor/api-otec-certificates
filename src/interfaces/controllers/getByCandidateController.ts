import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { IGetCertificateUseCase } from "../../application/ports/IGetCertificateUseCase";
import { Certificate } from "../../domain/entities/Certificate";
import { getPagination } from "../mappers";
import { Pagination } from "../../domain/entities/Pagination";

export default class GetByCandidateController implements AbstractController {
  private readonly methodName = 'GetController';
  private getUseCase;

  constructor(getUseCase: IGetCertificateUseCase) {
    this.getUseCase = getUseCase;
  }

  run = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      const rut :string = req.params.rut;
      const pagination :Pagination = await getPagination(req);
      const response = await this.getUseCase.byCandidateRut(rut, pagination);

      res.status(httpStatus.OK).json(response);

    } catch(error: any) {
      error.method = this.methodName;
      next(error);
    }
  }
}

