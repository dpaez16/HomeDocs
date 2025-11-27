import { fetchAllDocTypes } from "@/api/docTypes";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useContext, useMemo } from "react";
import { SelectSingle } from "../select-single";
import type { DocTypeID } from "@/types/docType";

interface SelectDocTypeProps {
    value: DocTypeID | null;
    onChange: (newValue: DocTypeID | null) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const SelectDocType: React.FC<SelectDocTypeProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data, loading } = useDataFetcher(() => fetchAllDocTypes(jwt));
    const options = useMemo(() => {
        if (!data) {
            return [];
        }

        return data.map(dt => ({
            label: dt.name,
            value: dt.docTypeID.toString(),
        }));
    }, [data]);

    return (
        <SelectSingle
            value={props.value?.toString() ?? null}
            onValueChange={(newValue) => props.onChange(newValue !== null ? parseInt(newValue) : null)}
            placeholder="Select document type ..."
            searchPlaceholder="Search document types"
            options={options}
            disabled={props.disabled}
            isLoading={loading}
        />
    );
};
