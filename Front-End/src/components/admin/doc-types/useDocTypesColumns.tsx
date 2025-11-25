import { textFilterFunc } from "@/components/ui/data-table/data-table-column-filter-funcs";
import { generateGenericTextColumn } from "@/components/ui/data-table/data-table-column-utils";
import type { DocType, DocTypeID } from "@/types/docType";

interface UseDocTypeColumnsProps {
    onNameClick: (docTypeID: DocTypeID) => void;
}

export const useDocTypesColumns = (props: UseDocTypeColumnsProps) => {
    return [
        generateGenericTextColumn<DocType>({
            id: 'name',
            accessorKey: 'name',
            columnHeader: 'Name',
            filterFn: textFilterFunc,
            onClick: (entry) => props.onNameClick(entry.docTypeID),
        }),
    ];
};
