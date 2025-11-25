import { editFileType, fetchFileType } from "@/api/fileTypes";
import { FormCheckbox } from "@/components/ui/form/form-checkbox";
import { FormInput } from "@/components/ui/form/form-input";
import { FormSection } from "@/components/ui/form/form-section";
import { SubmitButton } from "@/components/ui/form/submit-button";
import { UndoButton } from "@/components/ui/form/undo-button";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useForm } from "@/hooks/useForm";
import type { FileTypeID, FileType } from "@/types/fileType";
import { useContext } from "react";

interface EditFileTypeFormProps {
    fileTypeID: FileTypeID;
    onSuccess: () => void;
}

export const EditFileTypeForm: React.FC<EditFileTypeFormProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data: fileType, loading } = useDataFetcher(() => fetchFileType(props.fileTypeID, jwt));

    const form = useForm<FileType>({
        defaultValues: {
            fileTypeID: props.fileTypeID,
            name: fileType?.name ?? '',
            editable: !!fileType?.editable,
            diffable: !!fileType?.diffable,
            indexable: !!fileType?.indexable,
            extension: fileType?.extension ?? '',
        },
        isLoadingServerSideData: loading,
        validator: (formData) => !!formData.name && !!formData.extension,
        onSubmit: async (formData) => {
            await editFileType(formData, jwt)
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
