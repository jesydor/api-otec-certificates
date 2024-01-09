
import express from 'express';
import CreateCertificateUseCase from '../application/use-cases/CreateCertificateUseCase';
import PdfGenerationService from '../application/services/PdfGenerationService';
import GoogleCloudRepository from '../infrastructure/repositories/GoogleCloudRepository.ts';
import UploadCertificateUseCase from '../application/use-cases/UploadCertificateUseCase';
import CreateController from './controllers/createController';

const router = express.Router();

const pdfGenerationService = new PdfGenerationService();
const createUseCase = new CreateCertificateUseCase(pdfGenerationService);

const certificateRepository = new GoogleCloudRepository();
const uploadCertificateUseCase = new UploadCertificateUseCase(certificateRepository);

const createController = new CreateController(createUseCase, uploadCertificateUseCase);
router.get('/', createController.run);

export default router;
