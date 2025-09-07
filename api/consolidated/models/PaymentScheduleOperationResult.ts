/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { PaymentSchedule } from './PaymentSchedule';

export type PaymentScheduleOperationResult = {
    outcome?: PaymentScheduleOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: PaymentSchedule;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace PaymentScheduleOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
