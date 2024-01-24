import { IDocumentRepository } from "../../domain/ports/IDocumentRepository";
import { PostgreSQLDatabase } from "../../common/database/postgres/connection";
import { DocumentInfo } from "../../domain/entities/DocumentInfo";
import { Pagination } from "../../domain/entities/Pagination";
import { QueryResult } from 'pg';

export default class PgRepository implements IDocumentRepository {
    async getByCandidateRut(rut: string, pagination: Pagination): Promise<DocumentInfo[]> {
        const client = await PostgreSQLDatabase.getInstance().getClient();
        const response :DocumentInfo[] = [];
        try {
            const query = `SELECT * FROM documents.documents WHERE candidaterut = '${rut}' AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ${pagination.limit} OFFSET ${pagination.offset};`;
            const result: QueryResult<any> = await client.query(query);

            console.log(query);
            result.rows.forEach(document => {
                    response.push({
                        code: document?.code,
                        candidateRut: document?.candidaterut,
                        companyRut: document?.companyrut,
                        url: document?.url
                    }
                );
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
        const response :DocumentInfo = {
            code: "",
            candidateRut: "",
            companyRut: "",
            url: ""
        };

        try {
            const query = `SELECT * FROM documents.documents WHERE code = $1 AND deleted_at IS NULL;`;
            const result: QueryResult<any> = await client.query(query, [code]);
            if (result.rowCount) {
                response.code = result.rows[0]?.code;
                response.candidateRut = result.rows[0]?.candidaterut;
                response.companyRut = result.rows[0]?.companyrut;
                response.url = result.rows[0]?.url;

                return response;
            }

            return response; 
        } catch (error) {
            console.error('Error querying documents:', error);
            throw TypeError('Error getting documents');
        } finally {
            client.release();
        }
    }

    async save(documentInfo: DocumentInfo): Promise<DocumentInfo> {
        const client = await PostgreSQLDatabase.getInstance().getClient();
        const response :DocumentInfo = {
            code: "",
            candidateRut: "",
            companyRut: "",
            url: ""
        };

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
            if (result.rowCount) {
                const response = result.rows[0];
                return response;
            }

            return response; 
        } catch (error) {
            console.error('Error to insert document info:', error);
            throw TypeError('Error getting Projects');
        } finally {
            client.release();
        }
    }
}
