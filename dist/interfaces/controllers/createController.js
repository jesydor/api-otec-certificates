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
const loggerPino_1 = require("../../resources/loggerPino");
class CreateController {
    constructor(createUseCase, uploadCertificateUseCase) {
        this.methodName = 'CreateController';
        this.run = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const bucketName = process.env.BUCKET_CERTIFICATE;
            const waterMarkPath = `${process.cwd()}/src/resources/images/solid-watermark.png`;
            const waterMarkBase64 = fs_1.default.readFileSync(waterMarkPath).toString('base64');
            const logoPath = `${process.cwd()}/src/resources/images/logo-header.png`;
            const logoBase64 = fs_1.default.readFileSync(logoPath).toString('base64');
            const dorisCarrenoSignPath = `${process.cwd()}/src/resources/images/doris-carreno-sign.png`;
            const dorisCarrenoSignBase64 = fs_1.default.readFileSync(dorisCarrenoSignPath).toString('base64');
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
                    candidateName: req.body.candidateName,
                    candidateRut: req.body.candidateRut,
                    status: req.body.status,
                    approveDate: req.body.approveDate,
                    qr: '',
                    type: req.body.type,
                    otecName: req.body.otecName || '',
                };
                const errors = certificateValidator_1.default.validate(certificate);
                if (errors.length) {
                    loggerPino_1.loggerPino.info(`bad request ${req.body}}`);
                    res.status(http_status_1.default.BAD_REQUEST).json(errors);
                    next();
                }
                const fileName = `${certificate.companyLegalName}/${certificate.candidateName.replace(/ /g, "-")}/${certificate.code}-${certificate.courseCode}-${Date.now()}.pdf`;
                const qrCodeUrl = ` https://storage.googleapis.com/${bucketName}/${fileName}`;
                const gifBytes = yield qrcode_1.default.toBuffer(qrCodeUrl, {
                    errorCorrectionLevel: 'H'
                });
                certificate.qr = gifBytes.toString('base64');
                const response = yield this.createUseCase.pdf(certificate, fileName);
                if (response.error === '') {
                    res.status(http_status_1.default.CREATED).json(response.certificate);
                    next();
                }
                res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json();
            }
            catch (error) {
                error.method = this.methodName;
                loggerPino_1.loggerPino.error(`error ${error.method}}`);
                next(error);
            }
        });
        this.createUseCase = createUseCase;
    }
}
exports.default = CreateController;
