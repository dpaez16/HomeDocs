import { DataTableToolbar, type DataTableToolbarProps } from "@/components/ui/data-table/data-table-toolbar";
import type { FileType } from "@/types/fileType";
import { DatatableColumnFilter } from "@/components/ui/data-table/data-table-column-filter";

export const FileTypesTableToolbar = ({
    table,
}: DataTableToolbarProps<FileType>) => {
    return (
        <DataTableToolbar table={table}>
            <DatatableColumnFilter
                placeholder="Filter name..."
                column={table.getColumn('name')}
            />
        </DataTableToolbar>
    );
};
