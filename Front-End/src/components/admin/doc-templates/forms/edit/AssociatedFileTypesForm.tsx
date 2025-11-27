import { editAssociatedFileTypes, fetchAssociatedFileTypes } from "@/api/associatedFileTypes";
import { FormSection } from "@/components/ui/form/form-section";
import { SubmitButton } from "@/components/ui/form/submit-button";
import { UndoButton } from "@/components/ui/form/undo-button";
import { Label } from "@/components/ui/label";
import { SelectFileTypes } from "@/components/ui/pickers/select-filetypes";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useForm } from "@/hooks/useForm";
import type { AssociatedFileTypePatchData } from "@/types/associatedFileTypes";
import { type DocTemplateID } from "@/types/docTemplate";
import { useContext, useMemo } from "react";

interface AssociatedFileTypesFormProps {
    docTemplateID: DocTemplateID;
}

export const AssociatedFileTypesForm: React.FC<AssociatedFileTypesFormProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data, loading, refetch } = useDataFetcher(() => fetchAssociatedFileTypes(props.docTemplateID, jwt));

    const fileTypeIDs = useMemo(() => {
        if (!data) {
            return [];
        }

        return data.map(aft => aft.fileTypeID);
    }, [data]);

    const form = useForm<AssociatedFileTypePatchData>({
        defaultValues: {
            docTemplateID: props.docTemplateID,
            fileTypeIDs: fileTypeIDs,
        },
        isLoadingServerSideData: loading,
        onSubmit: async (formData) => {
            await editAssociatedFileTypes(formData, jwt)
                .then(() => refetch())
                .catch(err => alert(`Error: ${err.message}`));
            console.log(formData);
        },
    });

    return (
        <form className='flex flex-col justify-between h-full'>
            <FormSection>
                <Label>Associated File Types</Label>
                <SelectFileTypes
                    values={form.formData.fileTypeIDs}
                    onChange={(newValues) => form.setFormValue('fileTypeIDs', newValues)}
                    isLoading={loading}
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
