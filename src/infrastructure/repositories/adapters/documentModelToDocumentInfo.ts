import { QueryResult } from "pg";
import { DocumentInfo } from "../../../domain/entities/DocumentInfo";

export async function modeltoDocumentInfo(row: any ): Promise<DocumentInfo> {
    const response: DocumentInfo = {
        code: '',
        candidateRut: '',
        companyRut: '',
        url: '',
    };

    response.code = row?.code || '';
    response.candidateRut = row?.candidaterut || '';
    response.companyRut = row?.companyrut || '';
    response.url = row?.url || '';

    return response;
}