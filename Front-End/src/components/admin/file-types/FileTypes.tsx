import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useContext, useMemo } from "react";
import { PageContainer } from "@/components/ui/page/page-container";
import { PageHeader } from "@/components/ui/page/page-header";
import { PageDescription } from "@/components/ui/page/page-description";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useFileTypesColumns } from "./useFileTypesColumns";
import { FileTypesTableToolbar } from "./FileTypesTableToolbar";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { fetchAllFileTypes } from "@/api/fileTypes";

export const FileTypesPage = () => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data: fileTypes } = useDataFetcher(() => fetchAllFileTypes(jwt));

    const data = useMemo(() => {
        if (!fileTypes) {
            return [];
        }

        return fileTypes;
    }, [fileTypes]);

    const columns = useFileTypesColumns();

    return (
        <PageContainer className='flex flex-col gap-2'>
            <PageHeader>File Types</PageHeader>
            <PageDescription>All supported file types in HomeDocs.</PageDescription>
            <DataTable
                columns={columns}
                data={data}
                toolbar={FileTypesTableToolbar}
            />
        </PageContainer>
    );
};
