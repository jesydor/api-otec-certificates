import { Request } from 'express';
import { Pagination } from '../../domain/entities/Pagination';

export async function getPagination(request: Request): Promise<Pagination> {
    const queryParams = request.query;
    const limit = parseInt(queryParams.limit as string || '10', 10)
    const offset :number = (parseInt(queryParams.page as string || '1', 10)-1) * limit

    return { limit, offset }
}
