import { DataTableToolbar, type DataTableToolbarProps } from "@/components/ui/data-table/data-table-toolbar";
import type { FileType } from "@/types/fileType";
import { DataTableColumnFilter } from "@/components/ui/data-table/data-table-column-filter";

export const FileTypesTableToolbar = ({
    table,
    children,
}: DataTableToolbarProps<FileType>) => {
    return (
        <DataTableToolbar table={table}>
            <DataTableColumnFilter
                placeholder="Filter name..."
                column={table.getColumn('name')}
            />
            {children}
        </DataTableToolbar>
    );
};
