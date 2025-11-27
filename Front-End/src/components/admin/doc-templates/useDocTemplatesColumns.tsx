import { facetedFilterFunc, textFilterFunc } from "@/components/ui/data-table/data-table-column-filter-funcs";
import { generateGenericNumericColumn, generateGenericTextColumn } from "@/components/ui/data-table/data-table-column-utils";
import { DocTemplateStatus, type DocTemplate, type DocTemplateID } from "@/types/docTemplate";

interface UseDocTemplatesColumnsProps {
    onNameClick: (docTemplateID: DocTemplateID) => void;
}

export const useDocTemplatesColumns = (props: UseDocTemplatesColumnsProps) => {
    return [
        generateGenericTextColumn<DocTemplate>({
            id: 'name',
            accessorKey: 'name',
            columnHeader: 'Name',
            filterFn: textFilterFunc,
            onClick: (entry) => props.onNameClick(entry.docTypeID),
        }),
        generateGenericNumericColumn<DocTemplate>({
            id: 'status',
            accessorKey: 'status',
            columnHeader: 'Status',
            numberFormatterFunc: (num) => num === DocTemplateStatus.Active ? 'Active' : 'Archived',
            filterFn: facetedFilterFunc,
        }),
    ];
};
