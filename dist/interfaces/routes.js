"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createController_1 = __importDefault(require("./controllers/createController"));
const CreateCertificateUseCase_1 = __importDefault(require("../application/use-cases/CreateCertificateUseCase"));
const PdfGenerationService_1 = __importDefault(require("../application/services/PdfGenerationService"));
const router = express_1.default.Router();
const pdfGenerationService = new PdfGenerationService_1.default();
const createUseCase = new CreateCertificateUseCase_1.default(pdfGenerationService);
const createController = new createController_1.default(createUseCase);
router.get('/', createController.run);
exports.default = router;
