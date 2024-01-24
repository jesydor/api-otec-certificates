import { IDocumentRepository } from "../../domain/ports/IDocumentRepository";
import { PostgreSQLDatabase } from "../../common/database/postgres/connection";
import { DocumentInfo } from "../../domain/entities/DocumentInfo";
import { Pagination } from "../../domain/entities/Pagination";
import { QueryResult } from 'pg';
import { modeltoDocumentInfo } from "./adapters/documentModelToDocumentInfo";

export default class PgRepository implements IDocumentRepository {
    async getByCompanyRut(rut: string, pagination: Pagination): Promise<DocumentInfo[]> {
        const client = await PostgreSQLDatabase.getInstance().getClient();
        const response :DocumentInfo[] = [];
        try {
            const query = `SELECT * FROM documents.documents WHERE companyrut = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT $2 OFFSET $3;`;
            const result: QueryResult<any> = await client.query(query, [rut.toString(), pagination.limit, pagination.offset]);

            result.rows.forEach(async document => {
                    response.push(await modeltoDocumentInfo(document));
            });
            return response; 
        } catch (error) {
            console.error('Error querying documents by company:', error);
            throw TypeError('Error getting documents by company');
        } finally {
            client.release();
        }
    }
    async getByCandidateRut(rut: string, pagination: Pagination): Promise<DocumentInfo[]> {
        const client = await PostgreSQLDatabase.getInstance().getClient();
        const response :DocumentInfo[] = [];
        try {
            const query = `SELECT * FROM documents.documents WHERE candidateRut = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT $2 OFFSET $3;`;
            const result: QueryResult<any> = await client.query(query, [rut.toString(), pagination.limit, pagination.offset]);
            
            result.rows.forEach(async document => {
                    response.push(await modeltoDocumentInfo(document));
            });

            return response; 
        } catch (error) {
            console.error('Error querying documents:', error);
            throw TypeError('Error getting documents');
        } finally {
            client.release();
        }
    }

    async getByCode(code: string): Promise<DocumentInfo> {
        const client = await PostgreSQLDatabase.getInstance().getClient();
        try {
            const query = `SELECT * FROM documents.documents WHERE code = $1 AND deleted_at IS NULL;`;
            const result: QueryResult<any> = await client.query(query, [code]);
            return modeltoDocumentInfo(result);
        } catch (error) {
            console.error('Error querying documents:', error);
            throw TypeError('Error getting documents');
        } finally {
            client.release();
        }
    }

    async save(documentInfo: DocumentInfo): Promise<DocumentInfo> {
        const client = await PostgreSQLDatabase.getInstance().getClient();
        const checkQuery = `SELECT * FROM documents.documents WHERE code = $1;`;
        const checkResult: QueryResult<any> = await client.query(checkQuery, [documentInfo.code]);

        if (checkResult.rowCount) {
            return modeltoDocumentInfo(checkResult);
        }

        try {
            const query = `INSERT INTO documents.documents(code, candidateRut, companyRut, url) 
            VALUES($1, $2, $3, $4)
            RETURNING *;`;
        
            const values = [
                documentInfo.code,
                documentInfo.candidateRut,
                documentInfo.companyRut,
                documentInfo.url,
            ];
            
            const result: QueryResult<any> = await client.query(query, values);
            return modeltoDocumentInfo(result);
            
        } catch (error) {
            console.error('Error to insert document info:', error);
            throw TypeError('Error insert document info');
        } finally {
            client.release();
        }
    }
}
