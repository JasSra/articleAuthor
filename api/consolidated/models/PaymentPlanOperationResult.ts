/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { PaymentPlan } from './PaymentPlan';

export type PaymentPlanOperationResult = {
    outcome?: PaymentPlanOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: PaymentPlan;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace PaymentPlanOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

