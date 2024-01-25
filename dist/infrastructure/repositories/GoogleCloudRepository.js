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
const storage_1 = require("@google-cloud/storage");
class GoogleCloudRepository {
    upload(certificate, fileName, bucketName) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = process.env.PROJECT_ID || '';
            const response = {
                url: '',
                error: '',
            };
            try {
                const storageOptions = process.env.GOOGLE_APPLICATION_CREDENTIALS
                    ? {}
                    : { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS };
                const storage = new storage_1.Storage(storageOptions);
                const bucket = storage.bucket(bucketName);
                const archivoStream = bucket.file(fileName).createWriteStream();
                archivoStream.end(certificate);
                yield new Promise((resolve, reject) => {
                    archivoStream.on('finish', resolve);
                    archivoStream.on('error', reject);
                });
                response.url = `https://storage.googleapis.com/${bucketName}/${fileName}`;
            }
            catch (error) {
                response.error = `Error uploading file: ${error} - ${fileName}`;
                console.error(response.error);
            }
            return response;
        });
    }
}
exports.default = GoogleCloudRepository;
