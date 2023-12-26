import { AbstractController } from "./IController";
import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';

export default class CreateController implements AbstractController {
  private readonly methodName = 'CreateController';

  constructor(private createUseCase: ICreaterUseCase) {

  }


  run = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

      res.status(httpStatus.CREATED).json();
    } catch(error: any) {
      error.method = this.methodName;
      next(error);
    }
  }
}

