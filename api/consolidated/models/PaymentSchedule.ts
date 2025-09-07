/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentSchedule = {
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
    method?: PaymentSchedule.method;
    amount?: number;
    dueDate?: string;
    status?: string | null;
    transaction?: Array<string> | null;
    paymentIntent?: string | null;
};

export namespace PaymentSchedule {

    export enum method {
        SCHEDULED = 'Scheduled',
        MANUAL = 'Manual',
    }


}
