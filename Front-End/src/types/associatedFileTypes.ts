import type { DocTemplateID } from "./docTemplate"
import type { FileTypeID } from "./fileType";

export type AssociatedFileType = {
    docTemplateID: DocTemplateID;
    fileTypeID: FileTypeID;
};

export type AssociatedFileTypePatchData = {
    docTemplateID: DocTemplateID;
    fileTypeIDs: FileTypeID[];
};
