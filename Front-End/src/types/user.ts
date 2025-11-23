export type User = {
    userID: number;
    firstName: string;
    middleInitials: string | null;
    lastName: string | null;
    email: string;
    rights: number;
};

export type UserID = User['userID'];
export type UserRights = User['rights'];
