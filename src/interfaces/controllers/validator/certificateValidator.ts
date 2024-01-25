import { Certificate } from "../../../domain/entities/PdfCertificate";

export default class CertificateValidator {
  static validate(data: Certificate): string[] {
    const errors: string[] = [];
    const requiredFields: (keyof Certificate)[] = [
      'code',
      'companyRut',
      'companyLegalName',
      'courseName',
      'courseCode',
      'courseNumberHours',
      'validityCourse',
      'theoreticalStartDate',
      'theoreticalEndDate',
      'practicalStartDate',
      'practicalEndDate',
      'theoreticalFacilitator',
      'practicalFacilitator',
      'day',
      'month',
      'year',
      'candidateName',
      'candidateRut',
      'status',
      'approveDate',
      'qr'
    ];

    requiredFields.forEach(field => {
      const value = data[field];
      if (!value) {
        errors.push(`El campo ${field} es requerido.`);
      }
    });

    // Validación de formato de rut (puedes usar una librería como 'rut.js' para esto)
    if (!this.validateRut(data.candidateRut)) {
      errors.push('El Rut del candidato no es válido.');
    }

    if (!this.validateRut(data.companyRut)) {
      errors.push('El Rut de la empresa no es válido.');
    }

    return errors;
  }

  private static validateRut(rut: string): boolean {
    const rutFormat = /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/;
    if (!rutFormat.test(rut)) {
      return false;
    }
    const [rutNumbers, verifierDigit] = rut.split('-');
    const numbers = rutNumbers.split('.').join('');

    let sum = 0;
    let multiplier = 2;

    for (let i = numbers.length - 1; i >= 0; i--) {
      sum += parseInt(numbers[i], 10) * multiplier;
      multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }

    const expectedVerifierDigit = String(11 - (sum % 11));
    return expectedVerifierDigit === verifierDigit.toUpperCase();
  }

}