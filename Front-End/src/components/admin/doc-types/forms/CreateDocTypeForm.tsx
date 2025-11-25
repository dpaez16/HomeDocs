import { createDocType } from "@/api/docTypes";
import { FormInput } from "@/components/ui/form/form-input";
import { FormSection } from "@/components/ui/form/form-section";
import { SubmitButton } from "@/components/ui/form/submit-button";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useForm } from "@/hooks/useForm";
import { DocTypeStatus, type DocTypePatchData } from "@/types/docType";
import { useContext } from "react";

interface CreateDocTypeFormProps {
    onSuccess: () => void;
}

export const CreateDocTypeForm: React.FC<CreateDocTypeFormProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const form = useForm<DocTypePatchData>({
        defaultValues: {
            name: '',
            status: DocTypeStatus.Active,
        },
        validator: (formData) => !!formData.name,
        onSubmit: async (formData) => {
            await createDocType(formData, jwt)
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
            <SubmitButton form={form}>
                Save
            </SubmitButton>
        </form>
    );
};
