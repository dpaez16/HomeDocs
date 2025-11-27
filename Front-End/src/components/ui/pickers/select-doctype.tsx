import { fetchAllDocTypes } from "@/api/docTypes";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useContext, useMemo } from "react";
import { SelectSingle } from "../select-single";
import { DocTypeStatus, type DocTypeID } from "@/types/docType";

interface SelectDocTypeProps {
    value: DocTypeID | null;
    onChange: (newValue: DocTypeID | null) => void;
    isLoading?: boolean;
    disabled?: boolean;
    statuses?: DocTypeStatus[];
}

export const SelectDocType: React.FC<SelectDocTypeProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data, loading } = useDataFetcher(() => fetchAllDocTypes(jwt));
    const options = useMemo(() => {
        if (!data) {
            return [];
        }

        const statuses = props.statuses ?? [DocTypeStatus.Active];

        return data
            .filter(dt => statuses.includes(dt.status) || props.value === dt.docTypeID)
            .map(dt => ({
                label: dt.name,
                value: dt.docTypeID.toString(),
            }));
    }, [data, props.statuses, props.value]);

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
