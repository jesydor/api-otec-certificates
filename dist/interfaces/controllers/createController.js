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
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const http_status_1 = __importDefault(require("http-status"));
class CreateController {
    constructor(createUseCase, uploadCertificateUseCase) {
        this.methodName = 'CreateController';
        this.run = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const waterMarkPath = `${process.cwd()}/src/resources/images/solid-watermark.png`;
            const waterMarkBase64 = fs_1.default.readFileSync(waterMarkPath).toString('base64');
            const logoPath = `${process.cwd()}/src/resources/images/logo-header.png`;
            const logoBase64 = fs_1.default.readFileSync(logoPath).toString('base64');
            const dorisCarrenoSignPath = `${process.cwd()}/src/resources/images/doris-carreno-sign.png`;
            const dorisCarrenoSignBase64 = fs_1.default.readFileSync(dorisCarrenoSignPath).toString('base64');
            const qrCodeUrl = 'https://portalotecjesydor.cl/Administrador/Certificados/pdf/certificados2.0.php?idcertificado=103872';
            const gifBytes = yield qrcode_1.default.toBuffer(qrCodeUrl, {
                errorCorrectionLevel: 'H'
            });
            const data = {
                code: '103871',
                'sign': dorisCarrenoSignBase64,
                'logo-header': logoBase64,
                'watermark': waterMarkBase64,
                companyRut: '59.069.860-1',
                companyLegalName: 'ACCIONA CONSTRUCCION S.A',
                courseName: 'TRABAJO EN ALTURA FÍSICA TEÓRICO - PRACTICO',
                courseCode: 'CTP8-TA',
                courseNumberHours: 8,
                validityCourse: 4,
                theoreticalStartDate: '09-11-2023',
                theoreticalEndDate: '09-11-2023',
                practicalStartDate: '30-11-2023',
                practicalEndDate: '30-11-2023',
                theoreticalFacilitator: 'TATIANA JORQUERA OLIVARES',
                practicalFacilitator: 'JULIO BERNARDO GONZÁLEZ COLLAO',
                day: 9,
                month: 'Febrero',
                year: 2024,
                candidateName: 'LEONARDO ANDRES LEIVA DIAZ ',
                candidateRut: '13.505.775-4 ',
                status: 'Aprobado Nota:100',
                approveDate: '25 de Agosto 2023',
                qr: gifBytes.toString('base64')
            };
            try {
                const fileName = `${data.companyLegalName}/${data.candidateName.replace(/ /g, "-")}/${data.code}-${data.courseCode}-${Date.now()}.pdf`;
                const response = yield this.createUseCase.pdf(data, fileName);
                if (response.data !== '') {
                    res.status(http_status_1.default.OK).json(response.data);
                }
                res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json();
            }
            catch (error) {
                error.method = this.methodName;
                next(error);
            }
        });
        this.createUseCase = createUseCase;
    }
}
exports.default = CreateController;
