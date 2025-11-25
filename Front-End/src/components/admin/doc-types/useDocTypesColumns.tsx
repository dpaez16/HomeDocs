import { facetedFilterFunc, textFilterFunc } from "@/components/ui/data-table/data-table-column-filter-funcs";
import { generateGenericNumericColumn, generateGenericTextColumn } from "@/components/ui/data-table/data-table-column-utils";
import { DocTypeStatus, type DocType, type DocTypeID } from "@/types/docType";

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
        generateGenericNumericColumn<DocType>({
            id: 'status',
            accessorKey: 'status',
            columnHeader: 'Status',
            numberFormatterFunc: (num) => num === DocTypeStatus.Active ? 'Active' : 'Archived',
            filterFn: facetedFilterFunc,
        }),
    ];
};
