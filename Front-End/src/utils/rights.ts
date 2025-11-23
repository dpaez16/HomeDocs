import type { User } from "@/types/user";

export enum Rights {
    Reader = 1,
    Author = 2,
    Admin  = 4,
}

/**
 * Checks if a user has a specific privilege in the application.
 *
 * @param user The user to check.
 * @param right The privilege to check again the user.
 * @returns true if the user has the supplied privilege, false otherwise.
 */
export function hasRight(userRights: User['rights'], right: Rights) {
    return (userRights & right) > 0;
}
