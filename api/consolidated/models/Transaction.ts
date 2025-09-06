/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Transaction = {
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
    transactionId?: string | null;
    sessionId?: string | null;
    transactionStatus?: string | null;
    provider?: string | null;
    amount?: number;
    currency?: string | null;
    paymentMethod?: string | null;
    referenceId?: string | null;
    paymentIntent?: string | null;
    providerResponse?: string | null;
};

