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
            onClick: (entry) => {
                const params = new URLSearchParams({ userID: entry.userID.toString() });
                window.location.href = '/profile?' + params.toString();
            },
        }),
        generateGenericTextColumn<UserEntry>({
            id: 'email',
            accessorKey: 'email',
            columnHeader: 'Email',
            filterFn: textFilterFunc,
        }),
    ];
};
