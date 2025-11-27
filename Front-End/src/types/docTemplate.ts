export enum DocTemplateStatus {
    Active = 0,
    Archived = 1,
};

export type DocTemplate = {
    docTemplateID: number;
    docTypeID: number;
    name: string;
    status: DocTemplateStatus;
};

export type DocTemplateID = DocTemplate['docTemplateID'];
export type DocTemplatePostData = Omit<DocTemplate, 'docTemplateID'>;
export type DocTemplatePatchData = DocTemplate;
