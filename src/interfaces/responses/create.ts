import { Certificate } from "../../domain/entities/Certificate";

export interface CreateResponse {
    success: Certificate[];
    errors: {
        code: string;
        errors: string[];
    }[];
}