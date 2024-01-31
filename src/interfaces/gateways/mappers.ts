import { Request } from 'express';
import fs from 'fs';
import { Pagination } from '../../domain/entities/Pagination';
import { PdfCertificate } from '../../domain/entities/PdfCertificate';

export async function getPagination(request: Request): Promise<Pagination> {
    const queryParams = request.query;
    const limit = parseInt(queryParams.limit as string || '10', 10)
    const offset :number = (parseInt(queryParams.page as string || '1', 10)-1) * limit

    return { limit, offset }
}


export async function bodyToPdfCertificate(data: any): Promise<PdfCertificate> {
    const nodePath = process.env.NODE_PATH || 'src';
    const waterMarkPath = `${nodePath}/../../resources/images/solid-watermark.png`;
    const waterMarkBase64 = fs.readFileSync(waterMarkPath).toString('base64');

    const logoPath = `${nodePath}/../../resources/images/logo-header.png`;
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    const dorisCarrenoSignPath = `${nodePath}/../../resources/images/doris-carreno-sign.png`;
    const dorisCarrenoSignBase64 = fs.readFileSync(dorisCarrenoSignPath).toString('base64');

    const certificate: PdfCertificate = {
        code: data.code,
        'sign': dorisCarrenoSignBase64,
        'logo-header': logoBase64,
        'watermark': waterMarkBase64,
        companyRut: data.companyRut,
        companyLegalName: data.companyLegalName,
        courseName: data.courseName,
        courseCode: data.courseCode,
        courseNumberHours: data.courseNumberHours,
        validityCourse: data.validityCourse,
        theoreticalStartDate: data.theoreticalStartDate,
        theoreticalEndDate: data.theoreticalEndDate,
        practicalStartDate: data.practicalStartDate,
        practicalEndDate: data.practicalEndDate,
        theoreticalFacilitator: data.theoreticalFacilitator,
        practicalFacilitator: data.practicalFacilitator,
        candidateName: data.candidateName,
        candidateRut: data.candidateRut,
        status: data.status,
        approveDate: data.approveDate,
        qr: '',
        type: data.type,
        otecName: data.otecName || '',
      };


      return certificate;
}