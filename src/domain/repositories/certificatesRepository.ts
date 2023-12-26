interface CertificadosRepository {
  create(data: any): Promise<void>;
  get(certificateId: string, withReport: boolean): Promise<any>;
}
  
export default CertificadosRepository;
