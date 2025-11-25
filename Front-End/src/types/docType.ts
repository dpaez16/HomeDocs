export enum DocTypeStatus {
    Active = 0,
    Archived = 1,
};

export type DocType = {
    docTypeID: number;
    name: string;
    status: DocTypeStatus;
};

export type DocTypeID = DocType['docTypeID'];
export type DocTypePatchData = Omit<DocType, 'docTypeID'>;
