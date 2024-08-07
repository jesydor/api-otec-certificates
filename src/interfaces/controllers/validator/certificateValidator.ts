import { PdfCertificate } from "../../../domain/entities/PdfCertificate";
import { validateRut } from 'rutlib';

export default class CertificateValidator {
  static validate(data: PdfCertificate): string[] {
    const errors: string[] = [];
    const requiredFields: (keyof PdfCertificate)[] = [
      'code',
      'companyRut',
      'companyLegalName',
      'courseName',
      'courseCode',
      'courseNumberHours',
      'validityCourse',
      'theoreticalStartDate',
      'theoreticalEndDate',
      'theoreticalFacilitator',
      'candidateName',
      'candidateRut',
      'status',
      'approveDate',
    ];

    requiredFields.forEach(field => {
      const value = data[field];
      if (!value) {
        errors.push(`El campo ${field} es requerido.`);
      }
    });

    // Validación de formato de rut (puedes usar una librería como 'rut.js' para esto)
    if (!validateRut(data.candidateRut)) {
      errors.push('El Rut del candidato no es válido.');
    }

    if (!validateRut(data.companyRut)) {
      errors.push('El Rut de la empresa no es válido.');
    }

    return errors;
  }
}