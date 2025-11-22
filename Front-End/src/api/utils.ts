import type { JWT } from "../types/userInfo";

async function handleResponse(response: Response) {
    if (!response || (response.status !== 200 && response.status !== 201)) {
        const data = await response.json();
        throw new Error(data.error);
    }

    return response.json();
}

function createJSONBodyRequest(method: 'POST' | 'PATCH', path: string, body: object, jwt?: JWT) {
    const url = '/api' + path;

    return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt ?? '',
        },
    })
        .then(handleResponse);
}

/**
 * Constructs a GET request.
 *
 * @param path The backend route to send the request to.
 * @param params Query parameters to include in the request.
 * @param jwt JSON Web Token to include in the request, if supplied.
 * @returns A promise that resolves to the results of the request.
 */
export function createGETRequest(path: string, params?: URLSearchParams, jwt?: JWT) {
    let url = '/api' + path;
    if (params !== undefined && params.size > 0) {
        url += '?' + params.toString();
    }

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt ?? '',
        },
    })
        .then(handleResponse);
}

/**
 * Constructs a POST request.
 *
 * @param path The backend route to send the request to.
 * @param body Payload to include in the request.
 * @param jwt JSON Web Token to include in the request, if supplied.
 * @returns A promise that resolves to the results of the request.
 */
export function createPOSTRequest(path: string, body: object, jwt?: JWT) {
    return createJSONBodyRequest('POST', path, body, jwt);
}

/**
 * Constructs a PATCH request.
 *
 * @param path The backend route to send the request to.
 * @param body Payload to include in the request.
 * @param jwt JSON Web Token to include in the request, if supplied.
 * @returns A promise that resolves to the results of the request.
 */
export function createPATCHRequest(path: string, body: object, jwt?: JWT) {
    return createJSONBodyRequest('PATCH', path, body, jwt);
}
