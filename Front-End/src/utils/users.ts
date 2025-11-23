import type { User } from "@/types/user";

type NameFormat =
    'firstMiddleLast'       // Bob J Smith
    | 'lastFirstMiddle'     // Smith, Bob J
    | 'firstLast'           // Bob Smith
    ;

/**
 * Constructs a string representation of the user's name.
 *
 * @param user The user to get the string representation for.
 * @param format How the name should be formatted.
 * @returns The user's constructed name.
*/
export function constructFullName(user: User, format: NameFormat) {
    const firstName = user.firstName;
    const middleInitials = user.middleInitials ?? '';
    const lastName = user.lastName ?? '';

    if (format === 'firstMiddleLast') {
        const parts = [firstName, middleInitials, lastName].filter(part => part.length > 0);
        return parts.join(' ').trim();
    }

    if (format === 'lastFirstMiddle') {
        const parts = [
            lastName ? `${lastName},` : '',
            middleInitials,
            firstName,
        ].filter(part => part.length > 0);

        return parts.join(' ').trim();
    }

    if (format === 'firstLast') {
        const parts = [firstName, lastName].filter(part => part.length > 0);
        return parts.join(' ').trim();
    }

    // this should never happen
    return '';
}
