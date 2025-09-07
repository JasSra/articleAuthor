/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SignWithPayloadRequest = {
    payload: Record<string, any>;
    fields: Array<string>;
    ttlSeconds?: number;
    sessionId: string;
    method: string;
    targetHash: string;
    subject?: string | null;
    context?: string | null;
};
