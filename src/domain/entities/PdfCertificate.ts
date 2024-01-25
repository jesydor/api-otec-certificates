export interface PdfCertificate {
    code: string;
    sign: string;
    'logo-header': string;
    watermark: string;
    companyRut: string;
    companyLegalName: string;
    courseName: string;
    courseCode: string;
    courseNumberHours: number;
    validityCourse: number;
    theoreticalStartDate: string;
    theoreticalEndDate: string;
    practicalStartDate: string;
    practicalEndDate: string;
    theoreticalFacilitator: string;
    practicalFacilitator: string;
    day: number;
    month: string;
    year: number;
    candidateName: string;
    candidateRut: string;
    status: string;
    approveDate: string;
    qr: string;
    type: string;
  }
  