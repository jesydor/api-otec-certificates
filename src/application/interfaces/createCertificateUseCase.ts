export interface CreatePDF {
    run(data: string): Promise<string>;
  }