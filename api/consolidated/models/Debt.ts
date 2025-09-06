/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Debt = {
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
    owed?: number;
    isVerified?: string | null;
    status?: string | null;
    original?: number;
    description?: string | null;
    totalAdevaFees?: number;
    totalRemitAmount?: number;
    referenceId?: string | null;
    remittanceText?: string | null;
    stage?: Debt.stage;
    reason?: string | null;
    invoiceReference?: string | null;
    currency?: string | null;
    discountPercentage?: number;
    totalDiscount?: number;
    stripeCxId?: string | null;
    paymentPlanId?: string | null;
    documents?: Array<string> | null;
    messages?: Array<string> | null;
    organizationId?: string | null;
    debtorId?: string | null;
    remittanceRangeItemId?: string | null;
};

export namespace Debt {

    export enum stage {
        DRAFT = 'Draft',
        RAISED = 'Raised',
        PURSUING = 'Pursuing',
        ACTIVE_PAYMENT_PLAN = 'ActivePaymentPlan',
        PAYMENT_PLAN_COMPLETED = 'PaymentPlanCompleted',
        PAYMENT_PLAN_FAILED = 'PaymentPlanFailed',
        PAYMENT_PLAN_CANCELLED = 'PaymentPlanCancelled',
        CANCELLED_BY_ORGANIZATION = 'CancelledByOrganization',
    }


}

