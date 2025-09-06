/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Debt } from './Debt';
import type { EntityValidationError } from './EntityValidationError';

export type DebtOperationResult = {
    outcome?: DebtOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Debt;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace DebtOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

