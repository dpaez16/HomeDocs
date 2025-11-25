import { textFilterFunc } from "@/components/ui/data-table/data-table-column-filter-funcs";
import { generateGenericTextColumn } from "@/components/ui/data-table/data-table-column-utils";
import type { FileType, FileTypeID } from "@/types/fileType";

interface UseFileTypeColumnsProps {
    onNameClick: (fileTypeID: FileTypeID) => void;
}

export const useFileTypesColumns = (props: UseFileTypeColumnsProps) => {
    return [
        generateGenericTextColumn<FileType>({
            id: 'name',
            accessorKey: 'name',
            columnHeader: 'Name',
            filterFn: textFilterFunc,
            onClick: (entry) => props.onNameClick(entry.fileTypeID),
        }),
        generateGenericTextColumn<FileType>({
            id: 'extension',
            accessorKey: 'extension',
            columnHeader: 'Extension',
            filterFn: textFilterFunc,
        }),
    ];
};
