import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useContext } from "react";
import { useUsersColumns, type UserEntry } from "./useUsersColumns";
import { constructFullName } from "@/utils/users";
import { PageContainer } from "@/components/ui/page/page-container";
import { PageHeader } from "@/components/ui/page/page-header";
import { PageDescription } from "@/components/ui/page/page-description";
import { DataTable } from "@/components/ui/data-table/data-table";
import { UsersTableToolbar } from "./UsersTableToolbar";

export const UsersPage = () => {
    const { userSession } = useContext(LoginSessionContext);
    const user = userSession!.user;

    const data = [user].map(u => {
        return {
            userID: u.userID,
            name: constructFullName(u, 'firstMiddleLast'),
            email: u.email,
        } as UserEntry;
    });

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
