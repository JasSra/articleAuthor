/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Contact = {
    id?: string | null;
    definitionId?: string | null;
    ownerId?: string | null;
    attributes?: Record<string, any> | null;
    isDeleted?: boolean;
    createdAt?: number | null;
    updatedAt?: number | null;
    version?: number;
    tags?: Array<string> | null;
    embedding?: Array<number> | null;
    status?: string | null;
    relatedEntities?: Record<string, Array<string>> | null;
    state?: Record<string, string> | null;
    method?: Contact.method;
    value?: string | null;
    isPrimary?: boolean;
    isVerified?: boolean;
    createdDate?: string;
    modifiedDate?: string | null;
};

export namespace Contact {

    export enum method {
        EMAIL = 'Email',
        PHONE = 'Phone',
        SMS = 'SMS',
        MAIL = 'Mail',
        WHATS_APP = 'WhatsApp',
    }


}

