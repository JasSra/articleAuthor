/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BankDetails } from './BankDetails';
import type { EntityValidationError } from './EntityValidationError';

export type BankDetailsOperationResult = {
    outcome?: BankDetailsOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: BankDetails;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace BankDetailsOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
