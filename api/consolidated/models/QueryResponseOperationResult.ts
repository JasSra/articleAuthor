/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { QueryResponse } from './QueryResponse';

export type QueryResponseOperationResult = {
    outcome?: QueryResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: QueryResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace QueryResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
