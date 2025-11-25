import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useContext, useMemo, useState } from "react";
import { PageContainer } from "@/components/ui/page/page-container";
import { PageHeader } from "@/components/ui/page/page-header";
import { PageDescription } from "@/components/ui/page/page-description";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useFileTypesColumns } from "./useFileTypesColumns";
import { FileTypesTableToolbar } from "./FileTypesTableToolbar";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { fetchAllFileTypes } from "@/api/fileTypes";
import { Button } from "@/components/ui/button";
import { NativeDialog } from "@/components/ui/dialogs/native-dialog";
import { CreateFileTypeForm } from "./forms/CreateFileTypeForm";
import type { FileTypeID } from "@/types/fileType";
import { EditFileTypeForm } from "./forms/EditFileTypeForm";

export const FileTypesPage = () => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editFileTypeID, setEditFileTypeID] = useState<FileTypeID | undefined>(undefined);

    const { data: fileTypes, refetch } = useDataFetcher(() => fetchAllFileTypes(jwt));

    const data = useMemo(() => {
        if (!fileTypes) {
            return [];
        }

        return fileTypes;
    }, [fileTypes]);

    const columns = useFileTypesColumns({
        onNameClick: setEditFileTypeID,
    });

    return (
        <PageContainer className='flex flex-col gap-2'>
            <PageHeader>File Types</PageHeader>
            <PageDescription>All supported file types in HomeDocs.</PageDescription>
            <DataTable
                columns={columns}
                data={data}
                toolbar={(props) => (
                    <FileTypesTableToolbar table={props.table}>
                        <Button onClick={() => setCreateModalOpen(true)}>
                            Create New File Type
                        </Button>
                    </FileTypesTableToolbar>
                )}
            />
            <NativeDialog
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                dialogTitle='Create File Type'
            >
                <CreateFileTypeForm
                    onSuccess={() => {
                        setCreateModalOpen(false);
                        refetch();
                    }}
                />
            </NativeDialog>
            <NativeDialog
                isOpen={editFileTypeID !== undefined}
                onClose={() => setEditFileTypeID(undefined)}
                dialogTitle='Edit File Type'
            >
                <EditFileTypeForm
                    fileTypeID={editFileTypeID ?? -1}
                    onSuccess={() => {
                        setEditFileTypeID(undefined);
                        refetch();
                    }}
                />
            </NativeDialog>
        </PageContainer>
    );
};
