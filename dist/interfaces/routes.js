"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateCertificateUseCase_1 = __importDefault(require("../application/use-cases/CreateCertificateUseCase"));
const PdfGenerationService_1 = __importDefault(require("../application/services/PdfGenerationService"));
const UploadCertificateUseCase_1 = __importDefault(require("../application/use-cases/UploadCertificateUseCase"));
const PgRepository_1 = __importDefault(require("../infrastructure/repositories/PgRepository"));
const GoogleCloudRepository_1 = __importDefault(require("../infrastructure/repositories/GoogleCloudRepository"));
const createController_1 = __importDefault(require("./controllers/createController"));
const getByCodeController_1 = __importDefault(require("./controllers/getByCodeController"));
const getByCandidateController_1 = __importDefault(require("./controllers/getByCandidateController"));
;
const GetCertificateUseCase_1 = __importDefault(require("../application/use-cases/GetCertificateUseCase"));
const updateController_1 = __importDefault(require("./controllers/updateController"));
const DeleteCertificateUseCase_1 = __importDefault(require("../application/use-cases/DeleteCertificateUseCase"));
function routes(app) {
    const pdfGenerationService = new PdfGenerationService_1.default();
    const fileStorageRepository = new GoogleCloudRepository_1.default();
    const pgRepository = new PgRepository_1.default();
    const createUseCase = new CreateCertificateUseCase_1.default(pdfGenerationService, fileStorageRepository, pgRepository);
    const uploadFileUseCase = new UploadCertificateUseCase_1.default(fileStorageRepository);
    const getCertificateUseCase = new GetCertificateUseCase_1.default(pgRepository);
    const deleteUseCase = new DeleteCertificateUseCase_1.default(pgRepository);
    const createController = new createController_1.default(createUseCase, uploadFileUseCase);
    const getByCodeController = new getByCodeController_1.default(getCertificateUseCase);
    const getByCandidateController = new getByCandidateController_1.default(getCertificateUseCase);
    const getByCompanyController = new getByCandidateController_1.default(getCertificateUseCase);
    const updateController = new updateController_1.default(deleteUseCase, createUseCase);
    app.post(`${process.env.BASE_PATH}/certificates`, createController.run);
    app.put(`${process.env.BASE_PATH}/certificates/:code`, updateController.run);
    app.get(`${process.env.BASE_PATH}/certificates/:code`, getByCodeController.run);
    app.get(`${process.env.BASE_PATH}/certificates/candidate/:rut`, getByCandidateController.run);
    app.get(`${process.env.BASE_PATH}/certificates/company/:rut`, getByCompanyController.run);
}
exports.default = routes;
