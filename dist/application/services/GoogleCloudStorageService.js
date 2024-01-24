"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class GoogleCloudStorageService {
    uploadCertificate(file) {
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(file, (err, data) => {
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
exports.default = GoogleCloudStorageService;
