interface IDataStorageRepository {
    get(certificateId: string, withReport: boolean): Promise<any>;
}

export default IDataStorageRepository;
