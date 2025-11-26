import type { FileType, FileTypeID, FileTypePatchData, FileTypePostData } from "@/types/fileType";
import type { JWT } from "@/types/userSession";
import { createGETRequest, createPOSTRequest, createPATCHRequest, createDELETERequest } from "./utils";

/**
 * Fetches a specific file type.
 *
 * @param fileTypeID ID of the file type to fetch the data for.
 * @param jwt The user's login session token.
 * @returns A promise resolving to the file type's data.
 */
export function fetchFileType(fileTypeID: FileTypeID, jwt: JWT) {
    const params = new URLSearchParams({ fileTypeID: fileTypeID.toString() });
    return createGETRequest('/filetypes', params, jwt)
        .then((json) => json.filetype as FileType)
        .catch((err) => {
            throw new Error(`Could not fetch file type: ${err.message}`);
        });
}

/**
 * Fetches all file types.
 *
 * @param jwt The user's login session token.
 * @returns A promise resolving to a list of file types.
 */
export function fetchAllFileTypes(jwt: JWT) {
    return createGETRequest('/filetypes', undefined, jwt)
        .then((json) => json.filetypes as FileType[])
        .catch((err) => {
            throw new Error(`Could not fetch file types: ${err.message}`);
        });
}

/**
 * Creates a new file type.
 *
 * @param fileTypeData The initial data for the new file type.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function createFileType(fileTypeData: FileTypePostData, jwt: JWT) {
    return createPOSTRequest('/filetypes/create', fileTypeData, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not create new file type: ${err.message}`);
        });
}

/**
 * Mutates a file type.
 *
 * @param fileType The file type's data that will be used for the update.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function editFileType(fileType: FileTypePatchData, jwt: JWT) {
    return createPATCHRequest('/filetypes/edit', fileType, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not edit file type: ${err.message}`);
        });
}

/**
 * Deletes a file type.
 *
 * @param fileTypeID ID of the file type to delete.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function deleteFileType(fileTypeID: FileTypeID, jwt: JWT) {
    return createDELETERequest('/filetypes/delete', { fileTypeID }, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not delete file type: ${err.message}`);
        });
}
