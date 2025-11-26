export type FileType = {
    fileTypeID: number;
    name: string;
    editable: boolean;
    indexable: boolean;
    diffable: boolean;
    extension: string;
    isCanonical: boolean;
};

export type FileTypeID = FileType['fileTypeID'];
export type FileTypePostData = Omit<FileType, 'fileTypeID' | 'isCanonical'>;
export type FileTypePatchData = Omit<FileType, 'isCanonical'>;
