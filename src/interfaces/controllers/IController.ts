import { RequestHandler } from 'express';

export interface AbstractController {
    run: RequestHandler;
  }
  