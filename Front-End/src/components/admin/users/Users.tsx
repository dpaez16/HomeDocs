import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useContext, useMemo } from "react";
import { useUsersColumns, type UserEntry } from "./useUsersColumns";
import { constructFullName } from "@/utils/users";
import { PageContainer } from "@/components/ui/page/page-container";
import { PageHeader } from "@/components/ui/page/page-header";
import { PageDescription } from "@/components/ui/page/page-description";
import { DataTable } from "@/components/ui/data-table/data-table";
import { UsersTableToolbar } from "./UsersTableToolbar";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { fetchAllUsers } from "@/api/users";

export const UsersPage = () => {
    const { userSession } = useContext(LoginSessionContext);
    const jwt = userSession!.jwt;

    const { data: users } = useDataFetcher(() => fetchAllUsers(jwt));

    const data = useMemo(() => {
        if (!users) {
            return [];
        }

        return users.map(user => {
            return {
                userID: user.userID,
                email: user.email,
                name: constructFullName(user, 'firstMiddleLast'),
            } as UserEntry;
        });
    }, [users]);

    const columns = useUsersColumns();

    return (
        <PageContainer className='flex flex-col gap-2'>
            <PageHeader>Users</PageHeader>
            <PageDescription>All HomeDocs users.</PageDescription>
            <DataTable
                columns={columns}
                data={data}
                toolbar={UsersTableToolbar}
            />
        </PageContainer>
    );
};
