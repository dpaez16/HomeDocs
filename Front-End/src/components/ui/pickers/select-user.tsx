import { fetchAllUsers } from "@/api/users";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useContext, useMemo } from "react";
import { SelectSingle } from "../select-single";
import { constructFullName } from "@/utils/users";
import type { UserID, UserRights } from "@/types/user";

interface SelectUserProps {
    value: UserID | null;
    onChange: (newValue: UserID | null) => void;
    isLoading?: boolean;
    disabled?: boolean;
    rights: UserRights;
}

export const SelectUser: React.FC<SelectUserProps> = (props) => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data, loading } = useDataFetcher(() => fetchAllUsers(jwt));
    const options = useMemo(() => {
        if (!data) {
            return [];
        }

        return data
            .filter(user => {
                return (
                    ((props.rights & user.rights) > 0) ||
                    props.value === user.userID
                );
            })
            .map(user => ({
                label: constructFullName(user, 'firstMiddleLast'),
                value: user.userID.toString(),
            }));
    }, [data, props.rights, props.value]);

    return (
        <SelectSingle
            value={props.value?.toString() ?? null}
            onValueChange={(newValue) => props.onChange(newValue !== null ? parseInt(newValue) : null)}
            placeholder="Select user ..."
            searchPlaceholder="Search user"
            options={options}
            disabled={props.disabled}
            isLoading={loading}
        />
    );
};
