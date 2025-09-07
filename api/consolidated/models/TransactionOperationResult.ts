/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { Transaction } from './Transaction';

export type TransactionOperationResult = {
    outcome?: TransactionOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Transaction;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace TransactionOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
