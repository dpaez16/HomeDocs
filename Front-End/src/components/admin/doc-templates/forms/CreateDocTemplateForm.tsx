import { createDocTemplate } from "@/api/docTemplates";
import { FormInput } from "@/components/ui/form/form-input";
import { FormSection } from "@/components/ui/form/form-section";
import { SubmitButton } from "@/components/ui/form/submit-button";
import { Label } from "@/components/ui/label";
import { SelectDocType } from "@/components/ui/pickers/select-doctype";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useForm } from "@/hooks/useForm";
import { DocTemplateStatus, type DocTemplatePostData } from "@/types/docTemplate";
import { SetinelDocTypeID } from "@/utils/consts";
import { useContext } from "react";

interface CreateDocTemplateFormProps {
    onSuccess: () => void;
}

export const CreateDocTemplateForm: React.FC<CreateDocTemplateFormProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const form = useForm<DocTemplatePostData>({
        defaultValues: {
            docTypeID: SetinelDocTypeID,
            name: '',
            status: DocTemplateStatus.Active,
        },
        validator: (formData) => !!formData.name && formData.docTypeID !== SetinelDocTypeID,
        onSubmit: async (formData) => {
            await createDocTemplate(formData, jwt)
                .then(() => props.onSuccess())
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
                />
            </FormSection>
            <SubmitButton form={form}>
                Save
            </SubmitButton>
        </form>
    );
};
