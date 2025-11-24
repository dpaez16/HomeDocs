import { BookType, FileStack, FileType, NotepadTextDashed, TableOfContents, User, Users2 } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useContext } from "react";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { constructFullName } from "@/utils/users";
import { hasRight, Rights } from "@/utils/rights";
import { Link } from "react-router-dom";

export const AppSidebar = () => {
    const { userSession } = useContext(LoginSessionContext);
    const user = userSession!.user;

    const readerAuthorItems = [
        {
            title: 'My Documents',
            url: '/documents',
            icon: FileStack,
        },
        {
            title: 'Manuals',
            url: '/manuals',
            icon: TableOfContents,
        },
        {
            title: 'Profile',
            url: '/',
            icon: User,
        }
    ];

    const adminItems = [
        {
            title: 'File Types',
            url: '/admin/file-types',
            icon: FileType,
        },
        {
            title: 'Document Types',
            url: '/admin/doc-types',
            icon: BookType,
        },
        {
            title: 'Document Templates',
            url: '/admin/doc-templates',
            icon: NotepadTextDashed,
        },
        {
            title: 'Manuals',
            url: '/admin/manuals',
            icon: TableOfContents,
        },
        {
            title: 'Users',
            url: '/admin/users',
            icon: Users2,
        },
    ];

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{constructFullName(user, 'firstLast')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {readerAuthorItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {
                    hasRight(user.rights, Rights.Admin) &&
                    <SidebarGroup>
                        <SidebarGroupLabel>Administration</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {adminItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link to={item.url}>
                                                <item.icon />
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                }
            </SidebarContent>
        </Sidebar>
    );
};
