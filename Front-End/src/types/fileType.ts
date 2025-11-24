export type FileType = {
    fileTypeID: number;
    name: string;
    editable: boolean;
    indexable: boolean;
    diffable: boolean;
    extension: string;
};

export type FileTypeID = FileType['fileTypeID'];
export type FileTypePatchData = Omit<FileType, 'fileTypeID'>;
