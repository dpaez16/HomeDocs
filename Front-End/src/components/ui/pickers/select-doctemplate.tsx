import { fetchAllDocTemplates } from "@/api/docTemplates";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useContext, useMemo } from "react";
import { SelectSingle } from "../select-single";
import type { DocTemplateID } from "@/types/docTemplate";

interface SelectDocTemplateProps {
    value: DocTemplateID | null;
    onChange: (newValue: DocTemplateID | null) => void;
    docTypeID: DocTemplateID;
    isLoading?: boolean;
    disabled?: boolean;
}

export const SelectDocTemplate: React.FC<SelectDocTemplateProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data, loading } = useDataFetcher(() => fetchAllDocTemplates(jwt));
    const options = useMemo(() => {
        if (!data) {
            return [];
        }

        return data
            .filter(dt => dt.docTypeID === props.docTypeID)
            .map(dt => ({
                label: dt.name,
                value: dt.docTemplateID.toString(),
            }));
    }, [data, props.docTypeID]);

    return (
        <SelectSingle
            value={props.value?.toString() ?? null}
            onValueChange={(newValue) => props.onChange(newValue !== null ? parseInt(newValue) : null)}
            placeholder="Select document template ..."
            searchPlaceholder="Search document templates"
            options={options}
            disabled={props.disabled}
            isLoading={loading}
        />
    );
};
