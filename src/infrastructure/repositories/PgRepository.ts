import { IDocumentRepository } from "../../domain/ports/IDocumentRepository";
import { PostgreSQLDatabase } from "../../common/database/postgres/connection";
import { DocumentInfo } from "../../domain/entities/DocumentInfo";
import { Pagination } from "../../domain/entities/Pagination";
import { QueryResult } from 'pg';
import { modeltoDocumentInfo } from "./adapters/documentModelToDocumentInfo";
import { loggerPino } from "../../resources/loggerPino";

export default class PgRepository implements IDocumentRepository {
  async delete(code: string): Promise<boolean> {
    const client = await PostgreSQLDatabase.getInstance().getClient();
    try {
        const query = `UPDATE documents.documents SET deleted_at = NOW() WHERE code = $1 AND deleted_at IS NULL RETURNING *;`;
        const result: QueryResult<any> = await client.query(query, [code]);

        const isDeleted: boolean = (result.rowCount !== null && result.rowCount > 0);
        if (!isDeleted) {
            const deletedQuery = `SELECT * FROM documents.documents WHERE code = $1 AND deleted_at IS NOT NULL;`;
            const deletedResult: QueryResult<any> = await client.query(deletedQuery, [code]);
            return deletedResult.rowCount !== 0;
        }

        return isDeleted;
      } catch (error) {
          loggerPino.error(`Error deleting document: ${code} - ${error}`);
          throw new Error('Error deleting document');
      } finally {
          client.release();
      }
  }

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
        loggerPino.error(`Error getting company documents: ${rut} - ${error}`);
        throw TypeError('Error getting company documents by company');
    } finally {
        client.release();
    }
  }

  async getByCandidateRut(rut: string, pagination: Pagination): Promise<DocumentInfo[]> {
    const client = await PostgreSQLDatabase.getInstance().getClient();
    const response :DocumentInfo[] = [];

    try {
      const query = `SELECT * FROM documents.documents WHERE candidaterut = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT $2 OFFSET $3;`;
      const result: QueryResult<any> = await client.query(query, [rut.toString(), pagination.limit, pagination.offset]);
      
      result.rows.forEach(async document => {
        response.push(await modeltoDocumentInfo(document));
      });

      return response; 
    } catch (error) {
      loggerPino.error(`Error getting candidate documents: ${rut} - ${error}`);
      throw TypeError('Error getting candidate documents');
    } finally {
      client.release();
    }
  }

  async getByCode(code: string): Promise<DocumentInfo> {
    const client = await PostgreSQLDatabase.getInstance().getClient();
    try {
      const query = `SELECT * FROM documents.documents WHERE code = $1 AND deleted_at IS NULL;`;

      const result: QueryResult<any> = await client.query(query, [code]);
      return modeltoDocumentInfo(result.rows[0]);
    } catch (error) {
      loggerPino.error(`Error getting document code: ${code} - ${error}`);
      throw TypeError('Error getting documents');
    } finally {
      client.release();
    }
  }

  async save(documentInfo: DocumentInfo): Promise<DocumentInfo> {
    const client = await PostgreSQLDatabase.getInstance().getClient();
    try {
      const query = 'INSERT INTO documents.documents(code, candidateRut, companyRut, url) VALUES($1, $2, $3, $4) RETURNING *;';
      const values = [
        documentInfo.code,
        documentInfo.candidateRut,
        documentInfo.companyRut,
        documentInfo.url.replace('"', ''),
      ];
        
      const result: QueryResult<any> = await client.query(query, values);
      if (result.rowCount) {
        return modeltoDocumentInfo(result.rows[0]);
      }

      return {
        code: '',
        candidateRut: '',
        companyRut: '',
        url: ''
      };

    } catch (error) {
      loggerPino.error(`Error saving company documents: ${documentInfo.code} - ${error}`);
      throw TypeError('Error insert document info');
    } finally {
      client.release();
    }
  }

  async getByCodes(codes: string[]): Promise<DocumentInfo[]> {
    const client = await PostgreSQLDatabase.getInstance().getClient();
    try {
      const query = `SELECT * FROM documents.documents WHERE code IN (${codes.map((_, index) => `$${index + 1}`).join(', ')}) AND deleted_at IS NULL;`;
      const result: QueryResult<any> = await client.query(query, codes);
      const documentPromises = result.rows.map(async (document: any) => {
          return await modeltoDocumentInfo(document);
      });
      return Promise.all(documentPromises) as Promise<DocumentInfo[]>;
    } catch (error) {
      loggerPino.error(`Error getting documents codes: ${codes.join(', ')} - ${error}`);
      throw new Error('Error getting documents');
    } finally {
      client.release();
    }
  }
}
