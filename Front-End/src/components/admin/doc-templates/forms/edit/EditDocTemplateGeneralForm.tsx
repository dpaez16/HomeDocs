import { editDocTemplate, fetchDocTemplate } from "@/api/docTemplates";
import { FormInput } from "@/components/ui/form/form-input";
import { FormRadioGroup } from "@/components/ui/form/form-radio-group";
import { FormSection } from "@/components/ui/form/form-section";
import { SubmitButton } from "@/components/ui/form/submit-button";
import { UndoButton } from "@/components/ui/form/undo-button";
import { Label } from "@/components/ui/label";
import { SelectDocType } from "@/components/ui/pickers/select-doctype";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useForm } from "@/hooks/useForm";
import { type DocTemplateID, DocTemplateStatus, type DocTemplatePatchData } from "@/types/docTemplate";
import { SetinelDocTypeID } from "@/utils/consts";
import { useContext } from "react";

interface EditDocTemplateGeneralFormProps {
    docTemplateID: DocTemplateID;
}

export const EditDocTemplateGeneralForm: React.FC<EditDocTemplateGeneralFormProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data: docTemplate, loading, refetch } = useDataFetcher(() => fetchDocTemplate(props.docTemplateID, jwt));

    const form = useForm<DocTemplatePatchData>({
        defaultValues: {
            docTemplateID: props.docTemplateID,
            docTypeID: docTemplate?.docTypeID ?? SetinelDocTypeID,
            name: docTemplate?.name ?? '',
            status: docTemplate?.status ?? DocTemplateStatus.Active,
        },
        isLoadingServerSideData: loading,
        validator: (formData) => !!formData.name && formData.docTypeID !== SetinelDocTypeID,
        onSubmit: async (formData) => {
            await editDocTemplate(formData, jwt)
                .then(() => refetch())
                .catch(err => alert(`Error: ${err.message}`));
        },
    });

    return (
        <form className='flex flex-col gap-6'>
            <FormSection>
                <FormInput
                    id='name'
                    label='Name'
                    value={form.formData.name}
                    onChange={(e) => form.setFormValue('name', e.target.value)}
                    required
                />
            </FormSection>
            <FormSection>
                <Label>Document Type</Label>
                <SelectDocType
                    value={form.formData.docTypeID !== SetinelDocTypeID ? form.formData.docTypeID : null}
                    onChange={(newValue) => form.setFormValue('docTypeID', newValue !== null ? newValue : SetinelDocTypeID)}
                    isLoading={loading}
                />
            </FormSection>
            <FormSection>
                <FormRadioGroup
                    label='Status'
                    value={form.formData.status.toString()}
                    onChange={v => form.setFormValue('status', parseInt(v))}
                    options={[
                        {
                            label: 'Active',
                            value: DocTemplateStatus.Active.toString(),
                        },
                        {
                            label: 'Archived',
                            value: DocTemplateStatus.Archived.toString(),
                        },
                    ]}
                />
            </FormSection>
            <div className='grid grid-cols-2 gap-2'>
                <SubmitButton form={form}>
                    Save
                </SubmitButton>
                <UndoButton form={form}>
                    Undo
                </UndoButton>
            </div>
        </form>
    );
};
