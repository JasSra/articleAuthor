/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Organization = {
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
    state?: string | null;
    businessName?: string | null;
    businessNumber?: string | null;
    typeOfBusinessNumber?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    status?: string | null;
    remittanceScheduleId?: string | null;
    isVerified?: string | null;
    accounts?: Array<string> | null;
    businessApplication?: string | null;
    userId?: string | null;
    ip?: string | null;
    userAgent?: string | null;
    debtOwed?: number | null;
    expirationDate?: number | null;
    isFeeForwarded?: boolean | null;
    isTermsAndConditionAccepted?: boolean | null;
    applicationState?: string | null;
    submittedFormEntryId?: string | null;
    finalDecisionBy?: string | null;
    finalDecisionReason?: string | null;
};
