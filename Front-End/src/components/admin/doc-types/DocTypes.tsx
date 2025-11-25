import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useContext, useMemo, useState } from "react";
import { PageContainer } from "@/components/ui/page/page-container";
import { PageHeader } from "@/components/ui/page/page-header";
import { PageDescription } from "@/components/ui/page/page-description";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDocTypesColumns } from "./useDocTypesColumns";
import { DocTypesTableToolbar } from "./DocTypesTableToolbar";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { fetchAllDocTypes } from "@/api/docTypes";
import { Button } from "@/components/ui/button";
import { NativeDialog } from "@/components/ui/dialogs/native-dialog";
import { CreateDocTypeForm } from "./forms/CreateDocTypeForm";
import type { DocTypeID } from "@/types/docType";
import { EditDocTypeForm } from "./forms/EditDocTypeForm";

export const DocTypesPage = () => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editDocTypeID, setEditDocTypeID] = useState<DocTypeID | undefined>(undefined);

    const { data: docTypes, refetch } = useDataFetcher(() => fetchAllDocTypes(jwt));

    const data = useMemo(() => {
        if (!docTypes) {
            return [];
        }

        return docTypes;
    }, [docTypes]);

    const columns = useDocTypesColumns({
        onNameClick: setEditDocTypeID,
    });

    return (
        <PageContainer className='flex flex-col gap-2'>
            <PageHeader>Document Types</PageHeader>
            <PageDescription>All supported document types in HomeDocs.</PageDescription>
            <DataTable
                columns={columns}
                data={data}
                toolbar={(props) => (
                    <DocTypesTableToolbar table={props.table}>
                        <Button onClick={() => setCreateModalOpen(true)}>
                            Create New Document Type
                        </Button>
                    </DocTypesTableToolbar>
                )}
            />
            <NativeDialog
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                dialogTitle='Create Document Type'
            >
                <CreateDocTypeForm
                    onSuccess={() => {
                        setCreateModalOpen(false);
                        refetch();
                    }}
                />
            </NativeDialog>
            <NativeDialog
                isOpen={editDocTypeID !== undefined}
                onClose={() => setEditDocTypeID(undefined)}
                dialogTitle='Edit Document Type'
            >
                <EditDocTypeForm
                    docTypeID={editDocTypeID ?? -1}
                    onSuccess={() => {
                        setEditDocTypeID(undefined);
                        refetch();
                    }}
                />
            </NativeDialog>
        </PageContainer>
    );
};
