"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
class CreateCertificateUseCase {
    constructor(pdfGenerationService, certificateRepository, documentsRepository) {
        this.pdfGenerationService = pdfGenerationService;
        this.certificateRepository = certificateRepository;
        this.documentsRepository = documentsRepository;
    }
    pdf(data, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificate = {
                code: '',
                candidateRut: '',
                companyRut: '',
                url: ''
            };
            const htmlTemplate = yield promises_1.default.readFile(__dirname + '/../../resources/templates/theoretical-practical/certificateDev.handlebars', 'utf-8');
            const bucketName = 'otec-certificates';
            const pdfBuffer = yield this.pdfGenerationService.generatePdf(htmlTemplate, data);
            const response = yield this.certificateRepository.upload(pdfBuffer, fileName, bucketName);
            if (response.error !== '') {
                return {
                    certificate,
                    error: response.error,
                };
            }
            const documentInfo = {
                code: data.code,
                companyRut: data.companyRut,
                candidateRut: data.candidateRut,
                url: response.url,
            };
            const res = yield this.documentsRepository.save(documentInfo);
            certificate.code = res.code;
            certificate.candidateRut = res.candidateRut;
            certificate.companyRut = res.companyRut;
            certificate.url = res.url;
            return {
                certificate,
                error: '',
            };
        });
    }
}
exports.default = CreateCertificateUseCase;
