import { QueryResult } from "pg";
import { DocumentInfo } from "../../../domain/entities/DocumentInfo";

export async function modeltoDocumentInfo(result: QueryResult<any> ): Promise<DocumentInfo> {
    const response :DocumentInfo = {
        code: result.rows[0]?.code || '',
        candidateRut: result.rows[0]?.candidateRut || '',
        companyRut: result.rows[0]?.companyRut || '',
        url: result.rows[0]?.url || ''
    };

    return response;
}
