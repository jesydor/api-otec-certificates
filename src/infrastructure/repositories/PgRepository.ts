import { IDocumentRepository } from "../../domain/ports/IDocumentRepository";
import { PostgreSQLDatabase } from "../../common/database/postgres/connection";
import { DocumentInfo } from "../../domain/entities/DocumentInfo";
import { QueryResult } from 'pg';

export default class PgRepository implements IDocumentRepository {
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
                VALUES('${documentInfo.code}', '${documentInfo.candidateRut}', '${documentInfo.companyRut}', '${documentInfo.url}')
                RETURNING *;`;

            const result: QueryResult<any> = await client.query(query);
            if (result.rowCount) {
                const response = result.rows[0];
                return response;
            }

            return response; 
        } catch (error) {
            console.error('Error querying projects:', error);
            throw TypeError('Error getting Projects');
        } finally {
            client.release();
        }
    }
}
