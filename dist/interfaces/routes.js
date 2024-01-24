"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CreateCertificateUseCase_1 = __importDefault(require("../application/use-cases/CreateCertificateUseCase"));
const PdfGenerationService_1 = __importDefault(require("../application/services/PdfGenerationService"));
const UploadCertificateUseCase_1 = __importDefault(require("../application/use-cases/UploadCertificateUseCase"));
const PgRepository_1 = __importDefault(require("../infrastructure/repositories/PgRepository"));
const GoogleCloudRepository_1 = __importDefault(require("../infrastructure/repositories/GoogleCloudRepository"));
const createController_1 = __importDefault(require("./controllers/createController"));
const router = express_1.default.Router();
const pdfGenerationService = new PdfGenerationService_1.default();
const fileStorageRepository = new GoogleCloudRepository_1.default();
const pgRepository = new PgRepository_1.default();
const createUseCase = new CreateCertificateUseCase_1.default(pdfGenerationService, fileStorageRepository, pgRepository);
const uploadCertificateUseCase = new UploadCertificateUseCase_1.default(fileStorageRepository);
const createController = new createController_1.default(createUseCase, uploadCertificateUseCase);
router.get('/', createController.run);
exports.default = router;
