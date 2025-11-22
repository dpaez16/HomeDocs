import type { User } from "./user";

export type UserSession = {
    user: User;
    jwt: string;
};

export type JWT = UserSession['jwt'];
