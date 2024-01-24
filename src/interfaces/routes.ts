
import express from 'express';
import CreateCertificateUseCase from '../application/use-cases/CreateCertificateUseCase';
import PdfGenerationService from '../application/services/PdfGenerationService';
import UploadCertificateUseCase from '../application/use-cases/UploadCertificateUseCase';
import PgRepository from '../infrastructure/repositories/PgRepository';
import GoogleCloudRepository from '../infrastructure/repositories/GoogleCloudRepository';
import CreateController from './controllers/createController';
import GetController from './controllers/getController';
import GetCertificateUseCase from '../application/use-cases/GetCertificateUsecase';

const router = express.Router();

const pdfGenerationService = new PdfGenerationService();
const fileStorageRepository = new GoogleCloudRepository();
const pgRepository = new PgRepository();


const createUseCase = new CreateCertificateUseCase(pdfGenerationService, fileStorageRepository, pgRepository);
const uploadFileUseCase = new UploadCertificateUseCase(fileStorageRepository);
const getUseCase = new GetCertificateUseCase(pgRepository);

const createController = new CreateController(createUseCase, uploadFileUseCase);
const getController = new GetController(getUseCase);


router.post('/', createController.run);
router.get('/code/:code', getController.run);
router.get('/candidate/:candidateRut', createController.run);
router.get('/company/:candidateRut', createController.run);


export default router;
