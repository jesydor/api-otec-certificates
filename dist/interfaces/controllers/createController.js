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
Object.defineProperty(exports, "__esModule", { value: true });
class CreateController {
    constructor(createUseCase) {
        this.methodName = 'CreateController';
        this.run = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pdfBytes = yield this.createUseCase.pdf("");
                const buffer = Buffer.from(pdfBytes);
                // Configura los encabezados para la descarga del archivo
                res.setHeader('Content-Type', 'application/pdf');
                // res.setHeader('Content-Disposition', 'attachment; filename=nombre-del-archivo.pdf'); TO DOWNLOAD
                res.setHeader('Content-Disposition', 'inline; filename=nombre-del-archivo.pdf');
                res.status(200);
                res.type('pdf');
                res.send(buffer);
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
