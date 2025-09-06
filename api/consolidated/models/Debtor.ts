/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Debtor = {
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
    firstName?: string | null;
    lastName?: string | null;
    isVerified?: string | null;
    status?: string | null;
    userId?: string | null;
    debtorType?: Debtor.debtorType;
    contacts?: Array<string> | null;
    addresses?: Array<string> | null;
    accounts?: Array<string> | null;
    debts?: Array<string> | null;
    documents?: Array<string> | null;
};

export namespace Debtor {

    export enum debtorType {
        PERSON = 'Person',
        BUSINESS = 'Business',
    }


}

