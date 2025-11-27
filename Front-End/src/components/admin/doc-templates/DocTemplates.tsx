import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useContext, useMemo, useState } from "react";
import { PageContainer } from "@/components/ui/page/page-container";
import { PageHeader } from "@/components/ui/page/page-header";
import { PageDescription } from "@/components/ui/page/page-description";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDocTemplatesColumns } from "./useDocTemplatesColumns";
import { DocTemplatesTableToolbar } from "./DocTemplatesTableToolbar";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { fetchAllDocTemplates } from "@/api/docTemplates";
import { Button } from "@/components/ui/button";
import { NativeDialog } from "@/components/ui/dialogs/native-dialog";
import { CreateDocTemplateForm } from "./forms/CreateDocTemplateForm";
import type { DocTemplateID } from "@/types/docTemplate";
import { EditDocTemplate } from "./forms/edit/EditDocTemplate";

export const DocTemplatesPage = () => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editDocTemplateID, setEditDocTemplateID] = useState<DocTemplateID | undefined>(undefined);

    const { data: docTemplates, refetch } = useDataFetcher(() => fetchAllDocTemplates(jwt));

    const data = useMemo(() => {
        if (!docTemplates) {
            return [];
        }

        return docTemplates;
    }, [docTemplates]);

    const columns = useDocTemplatesColumns({
        onNameClick: setEditDocTemplateID,
    });

    return (
        <PageContainer className='flex flex-col gap-2'>
            <PageHeader>Document Templates</PageHeader>
            <PageDescription>All supported document templates in HomeDocs.</PageDescription>
            <DataTable
                columns={columns}
                data={data}
                toolbar={(props) => (
                    <DocTemplatesTableToolbar table={props.table}>
                        <Button onClick={() => setCreateModalOpen(true)}>
                            Create New Document Template
                        </Button>
                    </DocTemplatesTableToolbar>
                )}
            />
            <NativeDialog
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                dialogTitle='Create Document Type'
            >
                <CreateDocTemplateForm
                    onSuccess={() => {
                        setCreateModalOpen(false);
                        refetch();
                    }}
                />
            </NativeDialog>
            <NativeDialog
                isOpen={editDocTemplateID !== undefined}
                onClose={() => {
                    setEditDocTemplateID(undefined);
                    refetch();
                }}
                dialogTitle='Edit Document Template'
            >
                <EditDocTemplate
                    docTemplateID={editDocTemplateID ?? -1}
                />
            </NativeDialog>
        </PageContainer>
    );
};
