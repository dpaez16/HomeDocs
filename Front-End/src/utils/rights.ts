import type { UserRights } from "@/types/user";

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
export function hasRight(userRights: UserRights, right: Rights) {
    return (userRights & right) > 0;
}

/**
 * Adds a privilege to a user.
 *
 * @param userRights The user's current privileges.
 * @param right The privilege to add.
 * @returns The user's new privileges.
 */
export function addRight(userRights: UserRights, right: Rights) {
    return userRights | right;
}

/**
 * Removes a privilege from a user.
 *
 * @param userRights The user's current privileges.
 * @param right The privilege to remove.
 * @returns The user's new privileges.
 */
export function removeRight(userRights: UserRights, right: Rights) {
    if (!hasRight(userRights, right)) {
        return userRights;
    }

    return userRights ^ right;
}
