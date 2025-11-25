import { DataTableToolbar, type DataTableToolbarProps } from "@/components/ui/data-table/data-table-toolbar";
import type { UserEntry } from "./useUsersColumns";
import { DataTableColumnFilter } from "@/components/ui/data-table/data-table-column-filter";

export const UsersTableToolbar = ({
    table,
}: DataTableToolbarProps<UserEntry>) => {
    return (
        <DataTableToolbar table={table}>
            <DataTableColumnFilter
                placeholder="Filter emails..."
                column={table.getColumn('email')}
            />
        </DataTableToolbar>
    );
};
