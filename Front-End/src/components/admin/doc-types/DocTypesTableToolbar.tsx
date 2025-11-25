import { DataTableToolbar, type DataTableToolbarProps } from "@/components/ui/data-table/data-table-toolbar";
import { DataTableColumnFilter } from "@/components/ui/data-table/data-table-column-filter";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
import { DocTypeStatus, type DocType } from "@/types/docType";

export const DocTypesTableToolbar = ({
    table,
    children,
}: DataTableToolbarProps<DocType>) => {
    return (
        <DataTableToolbar table={table}>
            <DataTableColumnFilter
                placeholder="Filter name..."
                column={table.getColumn('name')}
            />
            <DataTableFacetedFilter
                column={table.getColumn('status')}
                title='Status'
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
            {children}
        </DataTableToolbar>
    );
};
