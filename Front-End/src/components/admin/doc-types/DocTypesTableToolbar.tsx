import { DataTableToolbar, type DataTableToolbarProps } from "@/components/ui/data-table/data-table-toolbar";
import type { DocType } from "@/types/docType";
import { DatatableColumnFilter } from "@/components/ui/data-table/data-table-column-filter";

export const DocTypesTableToolbar = ({
    table,
    children,
}: DataTableToolbarProps<DocType>) => {
    return (
        <DataTableToolbar table={table}>
            <DatatableColumnFilter
                placeholder="Filter name..."
                column={table.getColumn('name')}
            />
            {children}
        </DataTableToolbar>
    );
};
