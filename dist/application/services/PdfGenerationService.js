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
const handlebars_1 = __importDefault(require("handlebars"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const loggerPino_1 = require("../../resources/loggerPino");
class PdfGenerationService {
    generatePdf(htmlTemplate, data) {
        return __awaiter(this, void 0, void 0, function* () {
            loggerPino_1.loggerPino.info(`generating PDF ${data}}`);
            const template = handlebars_1.default.compile(htmlTemplate);
            const html = template(data);
            const browser = yield puppeteer_1.default.launch({ headless: "new", args: ['--enable-local-file-accesses', '--no-sandbox'] });
            const page = yield browser.newPage();
            yield page.setContent(html);
            const pdf = yield page.pdf({ format: 'Legal' });
            yield browser.close();
            return pdf;
        });
    }
}
exports.default = PdfGenerationService;
