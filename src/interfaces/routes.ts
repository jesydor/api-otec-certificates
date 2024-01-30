import { Application } from 'express';
import CreateCertificateUseCase from '../application/use-cases/CreateCertificateUseCase';
import PdfGenerationService from '../application/services/PdfGenerationService';
import UploadCertificateUseCase from '../application/use-cases/UploadCertificateUseCase';
import PgRepository from '../infrastructure/repositories/PgRepository';
import GoogleCloudRepository from '../infrastructure/repositories/GoogleCloudRepository';
import CreateController from './controllers/createController';
import GetByCodeController from './controllers/getByCodeController';
import GetByCandidateController from './controllers/getByCandidateController';;
import UpdateController from './controllers/updateController';
import DeleteCertificateUseCase from '../application/use-cases/DeleteCertificateUseCase';
import GetCertificateUseCase from '../application/use-cases/GetCertificateUsecase';
import GetByCompanyController from './controllers/getByCompanyController';

export default function routes(app: Application): void {
  const pdfGenerationService = new PdfGenerationService();
  const fileStorageRepository = new GoogleCloudRepository();
  const pgRepository = new PgRepository();

  const createUseCase = new CreateCertificateUseCase(pdfGenerationService, fileStorageRepository, pgRepository);
  const uploadFileUseCase = new UploadCertificateUseCase(fileStorageRepository);
  const getCertificateUseCase = new GetCertificateUseCase(pgRepository);
  const deleteUseCase = new DeleteCertificateUseCase(pgRepository);

  const createController = new CreateController(createUseCase, uploadFileUseCase);
  const getByCodeController = new GetByCodeController(getCertificateUseCase);
  const getByCandidateController = new GetByCandidateController(getCertificateUseCase);
  const getByCompanyController = new GetByCompanyController(getCertificateUseCase);
  const updateController = new UpdateController(deleteUseCase, createUseCase);

  app.post(`${process.env.BASE_PATH}/certificates`, createController.run);
  app.put(`${process.env.BASE_PATH}/certificates/:code`, updateController.run);
  app.get(`${process.env.BASE_PATH}/certificates/:code`, getByCodeController.run);
  app.get(`${process.env.BASE_PATH}/certificates/candidate/:rut`, getByCandidateController.run);
  app.get(`${process.env.BASE_PATH}/certificates/company/:rut`, getByCompanyController.run);
}
