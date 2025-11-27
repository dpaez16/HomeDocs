import { fetchAllFileTypes } from "@/api/fileTypes";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useContext, useMemo } from "react";
import { SelectMultiple } from "../select-multiple";
import type { FileTypeID } from "@/types/fileType";

interface SelectFileTypesProps {
    values: FileTypeID[];
    onChange: (newValues: FileTypeID[]) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const SelectFileTypes: React.FC<SelectFileTypesProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data, loading } = useDataFetcher(() => fetchAllFileTypes(jwt));
    const options = useMemo(() => {
        if (!data) {
            return [];
        }

        return data.map(ft => ({
            label: ft.name,
            value: ft.fileTypeID.toString(),
        }));
    }, [data]);

    return (
        <SelectMultiple
            values={props.values.map(v => v.toString())}
            onChange={(newValues) => props.onChange(newValues.map(v => parseInt(v)))}
            placeholder="Select file types ..."
            searchPlaceholder="Search file types"
            options={options}
            disabled={props.disabled}
            isLoading={loading}
            previewItemsCutoffLimit={3}
        />
    );
};
