/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BankDetails = {
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
    relatedEntities?: Record<string, Array<string>> | null;
    state?: Record<string, string> | null;
    bsb?: string | null;
    accountNumber?: string | null;
    accountName?: string | null;
    bankName?: string | null;
    swift?: string | null;
    status?: string | null;
    organization?: string | null;
    debtor?: string | null;
    createdDate?: string;
    modifiedDate?: string | null;
    isPrimary?: boolean;
};

