import { Request } from 'express';
import { Pagination } from '../../domain/entities/Pagination';
import { PdfCertificate } from '../../domain/entities/PdfCertificate';
import fs from 'fs';
import path from 'path'
import { loggerPino } from '../../resources/loggerPino';
import s from 'shelljs';
import { CreateRequest } from '../requests/create';

export async function getPagination(request: Request): Promise<Pagination> {
    const queryParams = request.query;
    const limit = parseInt(queryParams.limit as string || '10', 10)
    const offset :number = (parseInt(queryParams.page as string || '1', 10)-1) * limit

    return { limit, offset }
}

export async function bodyToPdfCertificateMap(data: any): Promise<Map<string, PdfCertificate>> {
    const waterMarkPath = path.join(__dirname, '../../', `resources/images/solid-watermark.png`);
    const waterMarkBase64 = fs.readFileSync(waterMarkPath).toString('base64');

    const logoPath = path.join(__dirname, '../../', `resources/images/logo-header.png`);
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    const dorisCarrenoSignPath = path.join(__dirname, '../../', `resources/images/doris-carreno-sign.png`);
    const dorisCarrenoSignBase64 = fs.readFileSync(dorisCarrenoSignPath).toString('base64');
    const certificates: Map<string, PdfCertificate> = new Map<string, PdfCertificate>();

    data.forEach((element: CreateRequest) => {
        let code =  element.code;
        if (!element.code)
            code = Math.random().toString(36).substring(2,7);
    
        certificates.set (code, {
            code: element.code,
            'sign': dorisCarrenoSignBase64,
            'logo-header': logoBase64,
            'watermark': waterMarkBase64,
            companyRut: element.companyRut,
            companyLegalName: element.companyLegalName,
            courseName: element.courseName,
            courseCode: element.courseCode,
            courseNumberHours: element.courseNumberHours,
            validityCourse: element.validityCourse,
            theoreticalStartDate: element.theoreticalStartDate,
            theoreticalEndDate: element.theoreticalEndDate,
            practicalStartDate: element.practicalStartDate,
            practicalEndDate: element.practicalEndDate,
            theoreticalFacilitator: element.theoreticalFacilitator,
            practicalFacilitator: element.practicalFacilitator,
            candidateName: element.candidateName,
            candidateRut: element.candidateRut,
            status: element.status,
            approveDate: element.approveDate,
            qr: '',
            type: element.type,
            otecName: element.otecName || '',
            courseContent: element?.courseContent
          } as PdfCertificate);
    });

    return certificates;
}


export async function bodyToPdfCertificate(data: any): Promise<PdfCertificate> {
    const waterMarkPath = path.join(__dirname, '../../', `resources/images/solid-watermark.png`);
    const waterMarkBase64 = fs.readFileSync(waterMarkPath).toString('base64');

    const logoPath = path.join(__dirname, '../../', `resources/images/logo-header.png`);
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    const dorisCarrenoSignPath = path.join(__dirname, '../../', `resources/images/doris-carreno-sign.png`);
    const dorisCarrenoSignBase64 = fs.readFileSync(dorisCarrenoSignPath).toString('base64');

    const certificate: PdfCertificate = {
        code: data.code as string,
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
        courseContent: data?.courseContent
      };

      return certificate;
}