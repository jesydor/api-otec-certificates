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
const pdf_lib_1 = require("pdf-lib");
const fs_1 = __importDefault(require("fs"));
class PdfGenerationService {
    generatePdf(htmlContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfDoc = yield pdf_lib_1.PDFDocument.create();
            const logoHeaderPath = 'src/resources/images/logo-header.jpeg';
            const logoHeader = yield this.readImage(logoHeaderPath);
            const jpgImage = yield pdfDoc.embedJpg(logoHeader);
            const jpgDims = jpgImage.scale(0.25);
            const timesRomanFont = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.TimesRoman);
            const page = pdfDoc.addPage(pdf_lib_1.PageSizes.Legal);
            page.drawImage(jpgImage, {
                x: page.getWidth() / 2 - jpgDims.width / 2,
                y: page.getHeight() - jpgDims.height / 2,
                width: jpgDims.width,
                height: jpgDims.height,
            });
            const fontSize = 25;
            page.drawText('CERTIFICADO DE ASISTENCIA Y APROBACIÓN', {
                x: 50,
                y: pdf_lib_1.PageSizes.Legal[0] - 4,
                size: fontSize,
                font: timesRomanFont,
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
            });
            const pdfBytes = yield pdfDoc.save();
            return pdfBytes;
        });
    }
    readImage(imgPath) {
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(imgPath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const base64String = Buffer.from(data).toString('base64');
                resolve(base64String);
            });
        });
    }
}
exports.default = PdfGenerationService;
