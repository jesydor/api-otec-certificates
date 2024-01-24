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
class PgRepository {
    save(documentInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield connection_1.PostgreSQLDatabase.getInstance().getClient();
            try {
                const query = `INSERT INTO documentas.documents(code, candidateRut, companyRut, url) 
                VALUES(${documentInfo.code}, ${documentInfo.candidateRut}, ${documentInfo.companyRut}, ${documentInfo.url}), `;
                const result = yield client.query(query);
                console.error(query);
                return '';
            }
            catch (error) {
                console.error('Error querying projects:', error);
                throw TypeError('Error getting Projects');
            }
            finally {
                client.release();
            }
        });
    }
}
exports.default = PgRepository;
