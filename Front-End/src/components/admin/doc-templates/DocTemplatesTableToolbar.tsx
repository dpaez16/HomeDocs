import { DataTableToolbar, type DataTableToolbarProps } from "@/components/ui/data-table/data-table-toolbar";
import { DataTableColumnFilter } from "@/components/ui/data-table/data-table-column-filter";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
import { DocTemplateStatus, type DocTemplate } from "@/types/docTemplate";

export const DocTemplatesTableToolbar = ({
    table,
    children,
}: DataTableToolbarProps<DocTemplate>) => {
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
                        value: DocTemplateStatus.Active.toString(),
                    },
                    {
                        label: 'Archived',
                        value: DocTemplateStatus.Archived.toString(),
                    },
                ]}
            />
            {children}
        </DataTableToolbar>
    );
};
