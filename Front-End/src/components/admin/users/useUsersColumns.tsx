import { textFilterFunc } from "@/components/ui/data-table/data-table-column-filter-funcs";
import { generateGenericTextColumn } from "@/components/ui/data-table/data-table-column-utils";
import type { UserID } from "@/types/user";

export interface UserEntry {
    userID: UserID;
    name: string;
    email: string;
}

export const useUsersColumns = () => {
    return [
        generateGenericTextColumn<UserEntry>({
            id: 'name',
            accessorKey: 'name',
            columnHeader: 'Name',
            filterFn: textFilterFunc,
        }),
        generateGenericTextColumn<UserEntry>({
            id: 'email',
            accessorKey: 'email',
            columnHeader: 'Email',
            filterFn: textFilterFunc,
        }),
    ];
};
