import { fetchAllDocTemplates } from "@/api/docTemplates";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useContext, useMemo } from "react";
import { SelectSingle } from "../select-single";
import { DocTemplateStatus, type DocTemplateID } from "@/types/docTemplate";

interface SelectDocTemplateProps {
    value: DocTemplateID | null;
    onChange: (newValue: DocTemplateID | null) => void;
    docTypeID: DocTemplateID;
    isLoading?: boolean;
    disabled?: boolean;
    statuses?: DocTemplateStatus[];
}

export const SelectDocTemplate: React.FC<SelectDocTemplateProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data, loading } = useDataFetcher(() => fetchAllDocTemplates(jwt));
    const options = useMemo(() => {
        if (!data) {
            return [];
        }

        const statuses = props.statuses ?? [DocTemplateStatus.Active];

        return data
            .filter(dt => {
                return (
                    dt.docTypeID === props.docTypeID &&
                    (statuses.includes(dt.status) || props.value === dt.docTemplateID)
                );
            })
            .map(dt => ({
                label: dt.name,
                value: dt.docTemplateID.toString(),
            }));
    }, [data, props.docTypeID, props.statuses, props.value]);

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
