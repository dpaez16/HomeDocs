import { editDocType, fetchDocType } from "@/api/docTypes";
import { FormInput } from "@/components/ui/form/form-input";
import { FormRadioGroup } from "@/components/ui/form/form-radio-group";
import { FormSection } from "@/components/ui/form/form-section";
import { SubmitButton } from "@/components/ui/form/submit-button";
import { UndoButton } from "@/components/ui/form/undo-button";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useForm } from "@/hooks/useForm";
import { type DocTypeID, type DocType, DocTypeStatus } from "@/types/docType";
import { useContext } from "react";

interface EditDocTypeFormProps {
    docTypeID: DocTypeID;
    onSuccess: () => void;
}

export const EditDocTypeForm: React.FC<EditDocTypeFormProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data: docType, loading } = useDataFetcher(() => fetchDocType(props.docTypeID, jwt));

    const form = useForm<DocType>({
        defaultValues: {
            docTypeID: props.docTypeID,
            name: docType?.name ?? '',
            status: docType?.status ?? DocTypeStatus.Active,
        },
        isLoadingServerSideData: loading,
        validator: (formData) => !!formData.name,
        onSubmit: async (formData) => {
            await editDocType(formData, jwt)
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
                <FormRadioGroup
                    label='Status'
                    value={form.formData.status.toString()}
                    onChange={v => form.setFormValue('status', parseInt(v))}
                    options={[
                        {
                            label: 'Active',
                            value: DocTypeStatus.Active.toString(),
                        },
                        {
                            label: 'Archived',
                            value: DocTypeStatus.Archived.toString(),
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
