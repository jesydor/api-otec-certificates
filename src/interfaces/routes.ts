
import express from 'express';
import CreateController from "./controllers/createController";
import CreateCertificateUseCase from '../application/use-cases/CreateCertificateUseCase';
import PdfGenerationService from '../application/services/PdfGenerationService';

const router = express.Router();

const pdfGenerationService = new PdfGenerationService();
const createUseCase = new CreateCertificateUseCase(pdfGenerationService);
const createController = new CreateController(createUseCase);

router.get('/', createController.run);

export default router;
