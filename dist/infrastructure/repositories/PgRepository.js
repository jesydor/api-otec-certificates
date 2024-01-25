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
const connection_1 = require("../../common/database/postgres/connection");
const documentModelToDocumentInfo_1 = require("./adapters/documentModelToDocumentInfo");
const loggerPino_1 = require("../../resources/loggerPino");
class PgRepository {
    delete(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield connection_1.PostgreSQLDatabase.getInstance().getClient();
            try {
                const query = `UPDATE documents.documents SET deleted_at = NOW() WHERE code = $1 AND deleted_at IS NULL RETURNING *;`;
                const result = yield client.query(query, [code]);
                const isDeleted = (result.rowCount !== null && result.rowCount > 0);
                return isDeleted;
            }
            catch (error) {
                loggerPino_1.loggerPino.error(`Error deleting document: ${code} - ${error}`);
                throw new Error('Error deleting document');
            }
            finally {
                client.release();
            }
        });
    }
    getByCompanyRut(rut, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield connection_1.PostgreSQLDatabase.getInstance().getClient();
            const response = [];
            try {
                const query = `SELECT * FROM documents.documents WHERE companyrut = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT $2 OFFSET $3;`;
                const result = yield client.query(query, [rut.toString(), pagination.limit, pagination.offset]);
                result.rows.forEach((document) => __awaiter(this, void 0, void 0, function* () {
                    response.push(yield (0, documentModelToDocumentInfo_1.modeltoDocumentInfo)(document));
                }));
                return response;
            }
            catch (error) {
                loggerPino_1.loggerPino.error(`Error getting company documents: ${rut} - ${error}`);
                throw TypeError('Error getting company documents by company');
            }
            finally {
                client.release();
            }
        });
    }
    getByCandidateRut(rut, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield connection_1.PostgreSQLDatabase.getInstance().getClient();
            const response = [];
            try {
                const query = `SELECT * FROM documents.documents WHERE candidaterut = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT $2 OFFSET $3;`;
                const result = yield client.query(query, [rut.toString(), pagination.limit, pagination.offset]);
                result.rows.forEach((document) => __awaiter(this, void 0, void 0, function* () {
                    response.push(yield (0, documentModelToDocumentInfo_1.modeltoDocumentInfo)(document));
                }));
                return response;
            }
            catch (error) {
                loggerPino_1.loggerPino.error(`Error getting candidate documents: ${rut} - ${error}`);
                throw TypeError('Error getting candidate documents');
            }
            finally {
                client.release();
            }
        });
    }
    getByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield connection_1.PostgreSQLDatabase.getInstance().getClient();
            try {
                const query = `SELECT * FROM documents.documents WHERE code = $1 AND deleted_at IS NULL;`;
                const result = yield client.query(query, [code]);
                return (0, documentModelToDocumentInfo_1.modeltoDocumentInfo)(result);
            }
            catch (error) {
                loggerPino_1.loggerPino.error(`Error getting document code: ${code} - ${error}`);
                throw TypeError('Error getting documents');
            }
            finally {
                client.release();
            }
        });
    }
    save(documentInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield connection_1.PostgreSQLDatabase.getInstance().getClient();
            const checkQuery = `SELECT * FROM documents.documents WHERE code = $1 AND deleted_at IS NULL;`;
            const checkResult = yield client.query(checkQuery, [documentInfo.code]);
            if (checkResult.rowCount) {
                return (0, documentModelToDocumentInfo_1.modeltoDocumentInfo)(checkResult.rows[0]);
            }
            try {
                const query = `INSERT INTO documents.documents(code, candidateRut, companyRut, url) 
        VALUES($1, $2, $3, $4)
        RETURNING *;`;
                const values = [
                    documentInfo.code,
                    documentInfo.candidateRut,
                    documentInfo.companyRut,
                    new URL(documentInfo.url),
                ];
                const result = yield client.query(query, values);
                return (0, documentModelToDocumentInfo_1.modeltoDocumentInfo)(result.rows[0]);
            }
            catch (error) {
                loggerPino_1.loggerPino.error(`Error saving company documents: ${documentInfo.code} - ${error}`);
                throw TypeError('Error insert document info');
            }
            finally {
                client.release();
            }
        });
    }
}
exports.default = PgRepository;
