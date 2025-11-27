import type { DocTemplateID } from "@/types/docTemplate";
import type { AssociatedFileType, AssociatedFileTypePatchData } from "@/types/associatedFileTypes";
import type { JWT } from "@/types/userSession";
import { createGETRequest, createPATCHRequest } from "./utils";

/**
 * Fetches all associated file types that are linked to a document template.
 *
 * @param docTemplateID ID of the document template to get its associated document templates.
 * @param jwt The user's login session token.
 * @returns A promise resolving to a list of the document template's associated file types.
 */
export function fetchAssociatedFileTypes(docTemplateID: DocTemplateID, jwt: JWT) {
    const params = new URLSearchParams({ docTemplateID: docTemplateID.toString() });
    return createGETRequest('/associatedfiletypes', params, jwt)
        .then((json) => json.associatedfiletypes as AssociatedFileType[])
        .catch((err) => {
            throw new Error(`Could not fetch associated file types: ${err.message}`);
        });
}

/**
 * Mutates the associated files types for a document template.
 *
 * @param data The data that will be used for setting the document template's associated file types.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function editAssociatedFileTypes(data: AssociatedFileTypePatchData, jwt: JWT) {
    return createPATCHRequest('/associatedfiletypes/edit', data, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not edit associated file types: ${err.message}`);
        });
}
