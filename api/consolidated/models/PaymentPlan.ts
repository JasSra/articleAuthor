/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentPlan = {
    id?: string | null;
    definitionId?: string | null;
    ownerId?: string | null;
    attributes?: Record<string, any> | null;
    createdAt?: number | null;
    updatedAt?: number | null;
    version?: number;
    tags?: Array<string> | null;
    embedding?: Array<number> | null;
    relatedEntities?: Record<string, Array<string>> | null;
    state?: Record<string, string> | null;
    amount?: number;
    frequency?: PaymentPlan.frequency;
    startDate?: string;
    endDate?: string | null;
    isDeleted?: boolean;
    status?: string | null;
    paymentSchedule?: Array<string> | null;
};

export namespace PaymentPlan {

    export enum frequency {
        NONE = 'None',
        WEEKLY = 'Weekly',
        FORTNIGHTLY = 'Fortnightly',
        MONTHLY = 'Monthly',
        QUARTERLY = 'Quarterly',
        YEARLY = 'Yearly',
        ONE_TIME = 'OneTime',
    }


}
