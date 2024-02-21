export interface CreateRequest {
    code: string;
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
    candidateName: string;
    candidateRut: string;
    status: string;
    approveDate: string;
    type: string;
    otecName: string;
    courseContent: string; 
}
