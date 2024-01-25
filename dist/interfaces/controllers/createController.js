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
const certificateValidator_1 = __importDefault(require("./validator/certificateValidator"));
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
            try {
                const certificate = {
                    code: req.body.code,
                    'sign': dorisCarrenoSignBase64,
                    'logo-header': logoBase64,
                    'watermark': waterMarkBase64,
                    companyRut: req.body.companyRut,
                    companyLegalName: req.body.companyLegalName,
                    courseName: req.body.courseName,
                    courseCode: req.body.courseCode,
                    courseNumberHours: req.body.courseNumberHours,
                    validityCourse: req.body.validityCourse,
                    theoreticalStartDate: req.body.theoreticalStartDate,
                    theoreticalEndDate: req.body.theoreticalEndDate,
                    practicalStartDate: req.body.practicalStartDate,
                    practicalEndDate: req.body.practicalEndDate,
                    theoreticalFacilitator: req.body.theoreticalFacilitator,
                    practicalFacilitator: req.body.practicalFacilitator,
                    day: req.body.day,
                    month: req.body.month,
                    year: req.body.year,
                    candidateName: req.body.candidateName,
                    candidateRut: req.body.candidateRut,
                    status: req.body.status,
                    approveDate: req.body.approveDate,
                    qr: gifBytes.toString('base64')
                };
                const errors = certificateValidator_1.default.validate(certificate);
                if (errors.length) {
                    res.status(http_status_1.default.BAD_REQUEST).json(errors);
                }
                const fileName = `${certificate.companyLegalName}/${certificate.candidateName.replace(/ /g, "-")}/${certificate.code}-${certificate.courseCode}-${Date.now()}.pdf`;
                const response = yield this.createUseCase.pdf(certificate, fileName);
                if (response.error === '') {
                    res.status(http_status_1.default.CREATED).json(response.certificate);
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
