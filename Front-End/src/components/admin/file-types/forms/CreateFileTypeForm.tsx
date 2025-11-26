import { createFileType } from "@/api/fileTypes";
import { FormCheckbox } from "@/components/ui/form/form-checkbox";
import { FormInput } from "@/components/ui/form/form-input";
import { FormSection } from "@/components/ui/form/form-section";
import { SubmitButton } from "@/components/ui/form/submit-button";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useForm } from "@/hooks/useForm";
import type { FileTypePostData } from "@/types/fileType";
import { useContext } from "react";

interface CreateFileTypeFormProps {
    onSuccess: () => void;
}

export const CreateFileTypeForm: React.FC<CreateFileTypeFormProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const form = useForm<FileTypePostData>({
        defaultValues: {
            name: '',
            editable: false,
            diffable: false,
            indexable: false,
            extension: '',
        },
        validator: (formData) => !!formData.name && !!formData.extension,
        onSubmit: async (formData) => {
            await createFileType(formData, jwt)
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
                <FormInput
                    id='extension'
                    label='Extension'
                    value={form.formData.extension}
                    onChange={(e) => form.setFormValue('extension', e.target.value)}
                    required
                />
            </FormSection>
            <FormSection>
                <FormCheckbox
                    id='editable'
                    label='Editable'
                    helpMessage='Documents with this file type can be directly edited in the HomeDocs text editor.'
                    checked={form.formData.editable}
                    onCheckedChange={(checkedState) => form.setFormValue('editable', !!checkedState.valueOf())}
                />
            </FormSection>
            <FormSection>
                <FormCheckbox
                    id='diffable'
                    label='Diffable'
                    helpMessage='Documents with this file type can be text differenced.'
                    checked={form.formData.diffable}
                    onCheckedChange={(checkedState) => form.setFormValue('diffable', !!checkedState.valueOf())}
                />
            </FormSection>
            <FormSection>
                <FormCheckbox
                    id='indexable'
                    label='Indexable'
                    helpMessage='Documents with this file type has text data that can be extracted for text indexing.'
                    checked={form.formData.indexable}
                    onCheckedChange={(checkedState) => form.setFormValue('indexable', !!checkedState.valueOf())}
                />
            </FormSection>
            <SubmitButton form={form}>
                Save
            </SubmitButton>
        </form>
    );
};
