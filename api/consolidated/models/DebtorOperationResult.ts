/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Debtor } from './Debtor';
import type { EntityValidationError } from './EntityValidationError';

export type DebtorOperationResult = {
    outcome?: DebtorOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Debtor;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace DebtorOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

