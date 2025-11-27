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

    const isReader = hasRight(user.rights, Rights.Reader);
    const isAuthor = hasRight(user.rights, Rights.Author);
    const isAdmin = hasRight(user.rights, Rights.Admin);

    const readerAuthorItems = [
        {
            title: 'My Documents',
            url: '/documents',
            icon: FileStack,
            isVisible: isAuthor,
        },
        {
            title: 'Manuals',
            url: '/manuals',
            icon: TableOfContents,
            isVisible: isReader || isAuthor,
        },
        {
            title: 'Profile',
            url: '/profile',
            icon: User,
            isVisible: true,
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
                            {readerAuthorItems.filter(item => item.isVisible).map((item) => (
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
                    isAdmin &&
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
