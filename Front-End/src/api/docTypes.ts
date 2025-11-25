import type { DocType, DocTypeID, DocTypePatchData } from "@/types/docType";
import type { JWT } from "@/types/userSession";
import { createGETRequest, createPOSTRequest, createPATCHRequest, createDELETERequest } from "./utils";

/**
 * Fetches a specific doc type.
 *
 * @param docTypeID ID of the doc type to fetch the data for.
 * @param jwt The user's login session token.
 * @returns A promise resolving to the doc type's data.
 */
export function fetchDocType(docTypeID: DocTypeID, jwt: JWT) {
    const params = new URLSearchParams({ docTypeID: docTypeID.toString() });
    return createGETRequest('/doctypes', params, jwt)
        .then((json) => json.doctype as DocType)
        .catch((err) => {
            throw new Error(`Could not fetch doc type: ${err.message}`);
        });
}

/**
 * Fetches all doc types.
 *
 * @param jwt The user's login session token.
 * @returns A promise resolving to a list of doc types.
 */
export function fetchAllDocTypes(jwt: JWT) {
    return createGETRequest('/doctypes', undefined, jwt)
        .then((json) => json.doctypes as DocType[])
        .catch((err) => {
            throw new Error(`Could not fetch doc types: ${err.message}`);
        });
}

/**
 * Creates a new doc type.
 *
 * @param docTypeData The initial data for the new doc type.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function createDocType(docTypeData: DocTypePatchData, jwt: JWT) {
    return createPOSTRequest('/doctypes/create', docTypeData, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not create new doc type: ${err.message}`);
        });
}

/**
 * Mutates a doc type.
 *
 * @param docType The doc type's data that will be used for the update.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function editDocType(docType: DocType, jwt: JWT) {
    return createPATCHRequest('/doctypes/edit', docType, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not edit doc type: ${err.message}`);
        });
}

/**
 * Deletes a doc type.
 *
 * @param docTypeID ID of the doc type to delete.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function deleteDocType(docTypeID: DocTypeID, jwt: JWT) {
    return createDELETERequest('/doctypes/delete', { docTypeID }, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not delete doc type: ${err.message}`);
        });
}
