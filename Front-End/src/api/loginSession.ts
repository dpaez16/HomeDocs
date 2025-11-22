import type { JWT, UserSession } from "../types/userSession";
import { createGETRequest } from "./utils";

/**
 * Attempts to sign the user to the application.
 *
 * @param email The user's email.
 * @param password The user's password.
 * @returns A promise resolving to a session object.
 */
export function loginUser(email: string, password: string) {
    const params = new URLSearchParams({
        email,
        password,
    });

    return createGETRequest('/users/login', params)
        .then((json) => {
            return json as UserSession;
        })
        .catch((err) => {
            throw new Error(`Could not login user: ${err.message}`);
        });
}

/**
 * Verifies the user's login session token.
 *
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the user has a valid login session, false otherwise.
 */
export function handshake(jwt: JWT | null) {
    if (!jwt) {
        return Promise.resolve(false);
    }

    return createGETRequest('/handshake', undefined, jwt)
        .then(() => true)
        .catch(() => false);
}
