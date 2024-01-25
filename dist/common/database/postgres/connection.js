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
exports.PostgreSQLDatabase = void 0;
const pg_1 = require("pg");
class PostgreSQLDatabase {
    constructor() {
        this.pool = new pg_1.Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: parseInt(process.env.PGPORT || '5432'),
        });
    }
    static getInstance() {
        if (!PostgreSQLDatabase.instance) {
            PostgreSQLDatabase.instance = new PostgreSQLDatabase();
        }
        return PostgreSQLDatabase.instance;
    }
    getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.pool.connect();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.end();
        });
    }
}
exports.PostgreSQLDatabase = PostgreSQLDatabase;
