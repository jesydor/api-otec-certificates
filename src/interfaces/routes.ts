
import express from 'express';
import CreateCertificateUseCase from '../application/use-cases/CreateCertificateUseCase';
import PdfGenerationService from '../application/services/PdfGenerationService';
import UploadCertificateUseCase from '../application/use-cases/UploadCertificateUseCase';
import PgRepository from '../infrastructure/repositories/PgRepository';
import GoogleCloudRepository from '../infrastructure/repositories/GoogleCloudRepository';
import CreateController from './controllers/createController';

const router = express.Router();

const pdfGenerationService = new PdfGenerationService();
const fileStorageRepository = new GoogleCloudRepository();
const pgRepository = new PgRepository();


const createUseCase = new CreateCertificateUseCase(pdfGenerationService, fileStorageRepository, pgRepository);

const uploadCertificateUseCase = new UploadCertificateUseCase(fileStorageRepository);
const createController = new CreateController(createUseCase, uploadCertificateUseCase);
router.get('/', createController.run);

export default router;
