import type { DocTemplate, DocTemplateID, DocTemplatePostData, DocTemplatePatchData } from "@/types/docTemplate";
import type { JWT } from "@/types/userSession";
import { createGETRequest, createPOSTRequest, createPATCHRequest, createDELETERequest } from "./utils";

/**
 * Fetches a specific doc template.
 *
 * @param docTemplateID ID of the doc template to fetch the data for.
 * @param jwt The user's login session token.
 * @returns A promise resolving to the doc template's data.
 */
export function fetchDocTemplate(docTemplateID: DocTemplateID, jwt: JWT) {
    const params = new URLSearchParams({ docTemplateID: docTemplateID.toString() });
    return createGETRequest('/doctemplates', params, jwt)
        .then((json) => json.doctemplate as DocTemplate)
        .catch((err) => {
            throw new Error(`Could not fetch doc template: ${err.message}`);
        });
}

/**
 * Fetches all doc templates.
 *
 * @param jwt The user's login session token.
 * @returns A promise resolving to a list of doc templates.
 */
export function fetchAllDocTemplates(jwt: JWT) {
    return createGETRequest('/doctemplates', undefined, jwt)
        .then((json) => json.doctemplates as DocTemplate[])
        .catch((err) => {
            throw new Error(`Could not fetch doc templates: ${err.message}`);
        });
}

/**
 * Creates a new doc template.
 *
 * @param docTemplateData The initial data for the new doc template.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function createDocTemplate(docTemplateData: DocTemplatePostData, jwt: JWT) {
    return createPOSTRequest('/doctemplates/create', docTemplateData, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not create new doc template: ${err.message}`);
        });
}

/**
 * Mutates a doc template.
 *
 * @param docTemplateData The doc template's data that will be used for the update.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function editDocTemplate(docTemplateData: DocTemplatePatchData, jwt: JWT) {
    return createPATCHRequest('/doctemplates/edit', docTemplateData, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not edit doc template: ${err.message}`);
        });
}

/**
 * Deletes a doc template.
 *
 * @param docTemplateID ID of the doc template to delete.
 * @param jwt The user's login session token.
 * @returns A promise resolving to true if the operation was successful.
 */
export function deleteDocTemplate(docTemplateID: DocTemplateID, jwt: JWT) {
    return createDELETERequest('/doctemplates/delete', { docTemplateID }, jwt)
        .then(() => true)
        .catch((err) => {
            throw new Error(`Could not delete doc template: ${err.message}`);
        });
}
