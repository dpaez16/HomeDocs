import { textFilterFunc } from "@/components/ui/data-table/data-table-column-filter-funcs";
import { generateGenericTextColumn } from "@/components/ui/data-table/data-table-column-utils";
import type { FileType } from "@/types/fileType";

export const useFileTypesColumns = () => {
    return [
        generateGenericTextColumn<FileType>({
            id: 'name',
            accessorKey: 'name',
            columnHeader: 'Name',
            filterFn: textFilterFunc,
        }),
    ];
};
