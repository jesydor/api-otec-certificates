import { ICreateCertificateUseCase } from '../ports/ICreateCertificateUseCase';
import PdfGenerationService from '../services/PdfGenerationService';
import fs from 'fs/promises';
import path from 'path';
import { CreateResponse } from '../../domain/entities/CreateResponse';
import IFileStorageRepository from '../../domain/ports/IFileStorageRepository';
import { IDocumentRepository } from '../../domain/ports/IDocumentRepository';
import { DocumentInfo } from '../../domain/entities/DocumentInfo';
import { Certificate } from '../../domain/entities/Certificate';
import { PdfCertificate } from '../../domain/entities/PdfCertificate';
import { CertificateType } from '../../domain/constants/CertificateType';



export default class CreateCertificateUseCase implements ICreateCertificateUseCase {
  private pdfGenerationService: PdfGenerationService;
  private certificateRepository: IFileStorageRepository;
  private documentsRepository: IDocumentRepository;

  constructor(pdfGenerationService: PdfGenerationService, certificateRepository: IFileStorageRepository, documentsRepository: IDocumentRepository)  {
    this.pdfGenerationService = pdfGenerationService;
    this.certificateRepository = certificateRepository;
    this.documentsRepository = documentsRepository;
  }

  async pdf(data: PdfCertificate, fileName: string): Promise<CreateResponse> {
    const bucketName = process.env.BUCKET_CERTIFICATE || 'otec-certificates';
    const nodePath = process.env.NODE_PATH || 'src';
    const certificate :Certificate = {
        code: '',
        candidateRut: '',
        companyRut: '',
        url: '',
      };

    const type = data.type as keyof typeof CertificateType;
    const template :string = `${process.cwd()}/${nodePath}/${CertificateType[type]}`;
    const htmlTemplate = await fs.readFile(template, 'utf-8');
    const pdfBuffer = await this.pdfGenerationService.generatePdf(htmlTemplate, data);
    const response = await this.certificateRepository.upload(pdfBuffer, fileName, bucketName);
    if (response.error !== '') {
      return {
        certificate,
        error: response.error,
      }; 
    }

    const documentInfo: DocumentInfo = {
      code: data.code,
      companyRut: data.companyRut,
      candidateRut: data.candidateRut,
      url: response.url,
    };
    
    const res = await this.documentsRepository.save(documentInfo);
    certificate.code = res.code;
    certificate.candidateRut = res.candidateRut;
    certificate.companyRut = res.companyRut;
    certificate.url = res.url;

    return {
      certificate,
      error: '',
    }; 
  }
}

