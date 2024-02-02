import { Request } from 'express';
import { Pagination } from '../../domain/entities/Pagination';
import { PdfCertificate } from '../../domain/entities/PdfCertificate';
import fs from 'fs';
import path from 'path'
import { loggerPino } from '../../resources/loggerPino';
import s from 'shelljs';

export async function getPagination(request: Request): Promise<Pagination> {
    const queryParams = request.query;
    const limit = parseInt(queryParams.limit as string || '10', 10)
    const offset :number = (parseInt(queryParams.page as string || '1', 10)-1) * limit

    return { limit, offset }
}

export async function bodyToPdfCertificate(data: any): Promise<PdfCertificate> {
    console.log(s.ls(process.cwd()));
    const waterMarkPath = path.join(process.cwd(), '../../', `resources/images/solid-watermark.png`);
    const waterMarkBase64 = fs.readFileSync(waterMarkPath).toString('base64');
    console.log('WATERMARK =>', waterMarkPath);

    const logoPath = path.join(__dirname, '../../', `resources/images/logo-header.png`);
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    console.log('LOGO =>', logoPath);

    
    const dorisCarrenoSignPath = path.join(__dirname, '../../', `resources/images/doris-carreno-sign.png`);
    const dorisCarrenoSignBase64 = fs.readFileSync(dorisCarrenoSignPath).toString('base64');
    console.log('SIGN =>', dorisCarrenoSignPath);


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