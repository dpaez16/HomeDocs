import type { User, UserID } from "@/types/user";
import type { JWT } from "@/types/userSession";
import { createGETRequest } from "./utils";

/**
 * Fetches a specific user.
 *
 * @param userID ID of the user to fetch the data for.
 * @param jwt The user's login session token.
 * @returns A promise resolving to the user's data.
 */
export function fetchUser(userID: UserID, jwt: JWT) {
    const params = new URLSearchParams({ userID: userID.toString() });
    return createGETRequest('/users', params, jwt)
        .then((json) => json.user as User)
        .catch((err) => {
            throw new Error(`Could not fetch user: ${err.message}`);
        });
}
